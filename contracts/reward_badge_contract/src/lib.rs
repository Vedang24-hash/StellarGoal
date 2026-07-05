#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short};

/// Badge type enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BadgeType {
    FirstGoal,       // Created first goal
    GoalCompleter,   // Completed a goal
    SavvySaver,      // Saved 100 XLM total
    Milestone100,    // Reached 100 XLM milestone
    Milestone500,    // Reached 500 XLM milestone
    Milestone1000,   // Reached 1000 XLM milestone
}

/// Badge structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Badge {
    pub id: String,
    pub badge_type: BadgeType,
    pub owner: Address,
    pub issued_at: u64,
    pub metadata: String, // Additional metadata (e.g., goal ID)
}

/// Badge issued event
#[contracttype]
#[derive(Clone, Debug)]
pub struct BadgeIssuedEvent {
    pub badge_id: String,
    pub owner: Address,
    pub badge_type: BadgeType,
}

/// Storage keys
#[contracttype]
pub enum DataKey {
    Badge(String),              // Badge ID -> Badge
    BadgesByOwner(Address),     // Owner Address -> Vec<String> (Badge IDs)
    BadgeCounter,               // Counter for badge IDs
    GoalManagerContract,        // Address of GoalManagerContract
}

#[contract]
pub struct RewardBadgeContract;

#[contractimpl]
impl RewardBadgeContract {
    /// Initialize the contract with goal manager contract address
    pub fn initialize(env: Env, goal_manager: Address) {
        env.storage().instance().set(&DataKey::GoalManagerContract, &goal_manager);
    }

    /// Issue a badge to a user
    /// Can be called by the GoalManagerContract or the user themselves
    pub fn issue_badge(
        env: Env,
        owner: Address,
        badge_type: BadgeType,
        metadata: String,
    ) -> String {
        // Verify the owner
        owner.require_auth();

        // Check if badge already exists for this user
        let has_badge_already = Self::has_badge(&env, &owner, &badge_type);
        if has_badge_already {
            panic!("Badge already issued");
        }

        // Generate unique badge ID
        let counter: u64 = env.storage()
            .instance()
            .get(&DataKey::BadgeCounter)
            .unwrap_or(0);
        
        let badge_id = String::from_str(&env, "BADGE");
        let new_counter = counter + 1;
        env.storage().instance().set(&DataKey::BadgeCounter, &new_counter);

        // Create badge
        let badge = Badge {
            id: badge_id.clone(),
            badge_type: badge_type.clone(),
            owner: owner.clone(),
            issued_at: env.ledger().timestamp(),
            metadata,
        };

        // Store badge
        env.storage().persistent().set(&DataKey::Badge(badge_id.clone()), &badge);

        // Add to owner's badge list
        let mut owner_badges: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::BadgesByOwner(owner.clone()))
            .unwrap_or(Vec::new(&env));
        owner_badges.push_back(badge_id.clone());
        env.storage().persistent().set(&DataKey::BadgesByOwner(owner.clone()), &owner_badges);

        // Emit event
        env.events().publish(
            (symbol_short!("issued"),),
            BadgeIssuedEvent {
                badge_id: badge_id.clone(),
                owner,
                badge_type,
            },
        );

        badge_id
    }

    /// Get a badge by ID
    pub fn get_badge(env: Env, badge_id: String) -> Option<Badge> {
        env.storage().persistent().get(&DataKey::Badge(badge_id))
    }

    /// Get all badges for an owner
    pub fn get_badges(env: Env, owner: Address) -> Vec<Badge> {
        let badge_ids: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::BadgesByOwner(owner))
            .unwrap_or(Vec::new(&env));

        let mut badges = Vec::new(&env);
        for badge_id in badge_ids.iter() {
            if let Some(badge) = env.storage().persistent().get::<DataKey, Badge>(&DataKey::Badge(badge_id)) {
                badges.push_back(badge);
            }
        }
        badges
    }

    /// Check if owner has a specific badge type
    fn has_badge(env: &Env, owner: &Address, badge_type: &BadgeType) -> bool {
        let badge_ids: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::BadgesByOwner(owner.clone()))
            .unwrap_or(Vec::new(env));

        for badge_id in badge_ids.iter() {
            if let Some(badge) = env.storage().persistent().get::<DataKey, Badge>(&DataKey::Badge(badge_id)) {
                if badge.badge_type == *badge_type {
                    return true;
                }
            }
        }
        false
    }

    /// Get badge count for an owner
    pub fn get_badge_count(env: Env, owner: Address) -> u32 {
        let badge_ids: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::BadgesByOwner(owner))
            .unwrap_or(Vec::new(&env));
        badge_ids.len()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_issue_badge() {
        let env = Env::default();
        let contract_id = env.register_contract(None, RewardBadgeContract);
        let client = RewardBadgeContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let metadata = String::from_str(&env, "First goal completed");

        let badge_id = client.issue_badge(&owner, &BadgeType::FirstGoal, &metadata);
        
        let badge = client.get_badge(&badge_id);
        assert!(badge.is_some());
    }

    #[test]
    fn test_get_badges() {
        let env = Env::default();
        let contract_id = env.register_contract(None, RewardBadgeContract);
        let client = RewardBadgeContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let metadata = String::from_str(&env, "Achievement");

        // Issue multiple badges
        client.issue_badge(&owner, &BadgeType::FirstGoal, &metadata);
        client.issue_badge(&owner, &BadgeType::GoalCompleter, &metadata);

        let badges = client.get_badges(&owner);
        assert_eq!(badges.len(), 2);
    }

    #[test]
    #[should_panic(expected = "Badge already issued")]
    fn test_duplicate_badge_prevention() {
        let env = Env::default();
        let contract_id = env.register_contract(None, RewardBadgeContract);
        let client = RewardBadgeContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let metadata = String::from_str(&env, "Test");

        client.issue_badge(&owner, &BadgeType::FirstGoal, &metadata);
        
        // Try to issue same badge type again - should panic
        client.issue_badge(&owner, &BadgeType::FirstGoal, &metadata);
    }
}

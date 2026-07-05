#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short};

/// Goal category types
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum GoalCategory {
    Emergency,
    Vacation,
    Education,
    Investment,
    Purchase,
    Other,
}

/// Goal status types
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum GoalStatus {
    Active,
    Completed,
}

/// Savings Goal structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Goal {
    pub id: String,
    pub owner: Address,
    pub title: String,
    pub target_amount: i128,
    pub current_amount: i128,
    pub category: GoalCategory,
    pub status: GoalStatus,
    pub created_at: u64,
    pub completed_at: Option<u64>,
}

/// Deposit record structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Deposit {
    pub id: String,
    pub goal_id: String,
    pub depositor: Address,
    pub amount: i128,
    pub timestamp: u64,
}

/// Events
#[contracttype]
#[derive(Clone, Debug)]
pub struct GoalCreatedEvent {
    pub goal_id: String,
    pub owner: Address,
    pub target_amount: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct DepositMadeEvent {
    pub goal_id: String,
    pub depositor: Address,
    pub amount: i128,
    pub new_balance: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct GoalCompletedEvent {
    pub goal_id: String,
    pub owner: Address,
    pub final_amount: i128,
}

/// Storage keys
#[contracttype]
pub enum DataKey {
    Goal(String),              // Goal ID -> Goal
    GoalsByOwner(Address),     // Owner Address -> Vec<String> (Goal IDs)
    Deposits(String),          // Goal ID -> Vec<Deposit>
    GoalCounter,               // Counter for goal IDs
    RewardContract,            // Address of RewardBadgeContract
}

#[contract]
pub struct GoalManagerContract;

#[contractimpl]
impl GoalManagerContract {
    /// Initialize the contract with reward contract address
    pub fn initialize(env: Env, reward_contract: Address) {
        env.storage().instance().set(&DataKey::RewardContract, &reward_contract);
    }

    /// Create a new savings goal
    pub fn create_goal(
        env: Env,
        owner: Address,
        title: String,
        target_amount: i128,
        category: GoalCategory,
    ) -> String {
        // Verify the owner
        owner.require_auth();

        // Validate inputs
        if target_amount <= 0 {
            panic!("Target amount must be positive");
        }

        // Generate unique goal ID
        let counter: u64 = env.storage()
            .instance()
            .get(&DataKey::GoalCounter)
            .unwrap_or(0);
        
        let goal_id = String::from_str(&env, "GOAL");
        let new_counter = counter + 1;
        env.storage().instance().set(&DataKey::GoalCounter, &new_counter);

        // Create goal
        let goal = Goal {
            id: goal_id.clone(),
            owner: owner.clone(),
            title,
            target_amount,
            current_amount: 0,
            category,
            status: GoalStatus::Active,
            created_at: env.ledger().timestamp(),
            completed_at: None,
        };

        // Store goal
        env.storage().persistent().set(&DataKey::Goal(goal_id.clone()), &goal);

        // Add to owner's goal list
        let mut owner_goals: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::GoalsByOwner(owner.clone()))
            .unwrap_or(Vec::new(&env));
        owner_goals.push_back(goal_id.clone());
        env.storage().persistent().set(&DataKey::GoalsByOwner(owner.clone()), &owner_goals);

        // Initialize empty deposits list
        let deposits: Vec<Deposit> = Vec::new(&env);
        env.storage().persistent().set(&DataKey::Deposits(goal_id.clone()), &deposits);

        // Emit event
        env.events().publish(
            (symbol_short!("goal_new"),),
            GoalCreatedEvent {
                goal_id: goal_id.clone(),
                owner,
                target_amount,
            },
        );

        goal_id
    }

    /// Deposit XLM to a goal
    pub fn deposit_to_goal(
        env: Env,
        goal_id: String,
        depositor: Address,
        amount: i128,
    ) {
        // Verify depositor
        depositor.require_auth();

        // Validate amount
        if amount <= 0 {
            panic!("Deposit amount must be positive");
        }

        // Load goal
        let mut goal: Goal = env.storage()
            .persistent()
            .get(&DataKey::Goal(goal_id.clone()))
            .expect("Goal not found");

        // Check if goal is active
        if goal.status != GoalStatus::Active {
            panic!("Goal is not active");
        }

        // Update goal balance
        goal.current_amount += amount;
        env.storage().persistent().set(&DataKey::Goal(goal_id.clone()), &goal);

        // Create deposit record
        let deposit = Deposit {
            id: String::from_str(&env, "DEP"),
            goal_id: goal_id.clone(),
            depositor: depositor.clone(),
            amount,
            timestamp: env.ledger().timestamp(),
        };

        // Add to deposits list
        let mut deposits: Vec<Deposit> = env.storage()
            .persistent()
            .get(&DataKey::Deposits(goal_id.clone()))
            .unwrap_or(Vec::new(&env));
        deposits.push_back(deposit);
        env.storage().persistent().set(&DataKey::Deposits(goal_id.clone()), &deposits);

        // Emit event
        env.events().publish(
            (symbol_short!("deposited"),),
            DepositMadeEvent {
                goal_id,
                depositor,
                amount,
                new_balance: goal.current_amount,
            },
        );
    }

    /// Complete a goal and issue badge
    pub fn complete_goal(env: Env, goal_id: String, owner: Address) {
        // Verify owner
        owner.require_auth();

        // Load goal
        let mut goal: Goal = env.storage()
            .persistent()
            .get(&DataKey::Goal(goal_id.clone()))
            .expect("Goal not found");

        // Verify ownership
        if goal.owner != owner {
            panic!("Not goal owner");
        }

        // Check if goal can be completed
        if goal.current_amount < goal.target_amount {
            panic!("Target not reached");
        }

        if goal.status != GoalStatus::Active {
            panic!("Goal already completed");
        }

        // Update goal status
        goal.status = GoalStatus::Completed;
        goal.completed_at = Some(env.ledger().timestamp());
        env.storage().persistent().set(&DataKey::Goal(goal_id.clone()), &goal);

        // Emit event
        env.events().publish(
            (symbol_short!("completed"),),
            GoalCompletedEvent {
                goal_id: goal_id.clone(),
                owner: owner.clone(),
                final_amount: goal.current_amount,
            },
        );

        // Call RewardBadgeContract to issue badge (inter-contract call)
        // Note: In production, this would invoke the reward contract
        // For example:
        // let reward_contract: Address = env.storage()
        //     .instance()
        //     .get(&DataKey::RewardContract)
        //     .ok_or(String::from_str(&env, "Reward contract not set"))?;
        // 
        // env.invoke_contract(
        //     &reward_contract,
        //     &Symbol::new(&env, "issue_badge"),
        //     (&owner, &String::from_str(&env, "goal_completer"))
        // );
    }

    /// Get a goal by ID
    pub fn get_goal(env: Env, goal_id: String) -> Option<Goal> {
        env.storage().persistent().get(&DataKey::Goal(goal_id))
    }

    /// Get all goals for an owner
    pub fn get_goals_by_owner(env: Env, owner: Address) -> Vec<Goal> {
        let goal_ids: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::GoalsByOwner(owner))
            .unwrap_or(Vec::new(&env));

        let mut goals = Vec::new(&env);
        for goal_id in goal_ids.iter() {
            if let Some(goal) = env.storage().persistent().get::<DataKey, Goal>(&DataKey::Goal(goal_id)) {
                goals.push_back(goal);
            }
        }
        goals
    }

    /// Get deposit history for a goal
    pub fn get_deposit_history(env: Env, goal_id: String) -> Vec<Deposit> {
        env.storage()
            .persistent()
            .get(&DataKey::Deposits(goal_id))
            .unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_create_goal() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, GoalManagerContract);
        let client = GoalManagerContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let title = String::from_str(&env, "Emergency Fund");
        let target_amount: i128 = 1000_0000000; // 1000 XLM

        let goal_id = client.create_goal(&owner, &title, &target_amount, &GoalCategory::Emergency);
        
        let goal = client.get_goal(&goal_id);
        assert!(goal.is_some());
    }

    #[test]
    fn test_deposit_to_goal() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, GoalManagerContract);
        let client = GoalManagerContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let title = String::from_str(&env, "Vacation Fund");
        let target_amount: i128 = 500_0000000;

        let goal_id = client.create_goal(&owner, &title, &target_amount, &GoalCategory::Vacation);
        
        let deposit_amount: i128 = 100_0000000;
        client.deposit_to_goal(&goal_id, &owner, &deposit_amount);

        let goal = client.get_goal(&goal_id).unwrap();
        assert_eq!(goal.current_amount, deposit_amount);
    }

    #[test]
    fn test_complete_goal() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, GoalManagerContract);
        let client = GoalManagerContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let title = String::from_str(&env, "Test Goal");
        let target_amount: i128 = 100_0000000;

        let goal_id = client.create_goal(&owner, &title, &target_amount, &GoalCategory::Other);
        
        // Deposit to reach target
        client.deposit_to_goal(&goal_id, &owner, &target_amount);

        // Complete goal
        client.complete_goal(&goal_id, &owner);

        let goal = client.get_goal(&goal_id).unwrap();
        assert_eq!(goal.status, GoalStatus::Completed);
    }
}

const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    // Cosmos DB configuration
    const endpoint = process.env.COSMOS_DB_URI;  // Use environment variables for better security
    const key = process.env.COSMOS_DB_PRIMARY_KEY; // Fetch the primary key from environment variables
    const client = new CosmosClient({ endpoint, key });

    const database = client.database("BankingDB");  // Replace with your actual database name
    const container = database.container("Accounts"); // Replace with your actual container name

    // Handle GET Request - Retrieve all accounts
    if (req.method === "GET") {
        try {
            const { resources: items } = await container.items.readAll().fetchAll();
            context.res = {
                status: 200,
                body: items
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: "Error fetching accounts: " + error.message
            };
        }
    }

    // Handle POST Request - Add a new account
    else if (req.method === "POST") {
        const newAccount = req.body;

        // Ensure valid data is provided
        if (!newAccount.id || !newAccount.accountHolder || typeof newAccount.balance !== "number") {
            context.res = {
                status: 400,
                body: "Please provide a valid account with 'id', 'accountHolder', and 'balance'."
            };
            return;
        }

        try {
            const { resource: createdItem } = await container.items.create(newAccount);
            context.res = {
                status: 201,
                body: createdItem
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: "Error creating account: " + error.message
            };
        }
    }

    // Handle unsupported HTTP methods
    else {
        context.res = {
            status: 405,
            body: "Method Not Allowed"
        };
    }
};

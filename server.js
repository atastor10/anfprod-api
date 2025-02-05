require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express(); // ✅ Define Express app at the beginning
const PORT = process.env.PORT || 5000;

// Database Configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true, 
        trustServerCertificate: true,
    },
};

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Connect to Database
async function connectDB() {
    try {
        await sql.connect(dbConfig);
        console.log("✅ Connected to SQL Server successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
}
connectDB();

// ✅ Define API Routes AFTER `app` is declared

// Get All Services
app.get("/api/services", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM Services");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get All Orders
app.get("/api/orders", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT O.OrderID, C.ClientName, O.TotalPrice, O.SubscriptionType, O.SubscriptionRevenue
            FROM Orders O
            JOIN Clients C ON O.ClientID = C.ClientID
        `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get Order Items
app.get("/api/order-items", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT OI.OrderID, S.ServiceName, OI.Quantity, OI.UnitPrice
            FROM Order_Items OI
            JOIN Services S ON OI.ServiceID = S.ServiceID
        `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get Sales Summary
app.get("/api/sales-summary", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM SalesSummary");
        res.json(result.recordset[0]); // Send as JSON object
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// ✅ Start Server AFTER defining all routes
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#22d3ee",
  "#818cf8",
  "#4ade80",
  "#f59e0b",
  "#ef4444",
];

export default function FinanceDashboard() {

  const [activeTab, setActiveTab] =
    useState("Dashboard");

  const [expenses, setExpenses] =
    useState([]);

  const [aiInsights, setAiInsights] =
    useState([]);

  const [category, setCategory] =
    useState("Food");

  const [amount, setAmount] =
    useState("");

  const [salary, setSalary] =
    useState("");

  const [goal, setGoal] =
    useState("");

  const token =
    localStorage.getItem("token");

  // =========================
  // FETCH EXPENSES
  // =========================

  const fetchExpenses = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/expenses",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setExpenses(
        res.data.expenses
      );

    } catch (err) {

      console.log(
        "EXPENSE ERROR:",
        err
      );

    }
  };

  // =========================
  // FETCH AI INSIGHTS
  // =========================

  const fetchAIInsights = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/ai-advice",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setAiInsights(
          res.data.insights || []
      );

    } catch (err) {

      console.log(
        "AI ERROR:",
        err
      );

    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    fetchExpenses();

    fetchAIInsights();

  }, []);

  // =========================
  // ADD EXPENSE
  // =========================

const addExpense = async () => {

  try {

    const token =
      localStorage.getItem("token");

    console.log("TOKEN:", token);

    console.log(
      "AUTH:",
      `Bearer ${token}`
    );

    const response = await axios.post(
      "http://localhost:8000/expense",
      {
        category,
        amount: parseFloat(amount),
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
          "Content-Type":
            "application/json",
        },
      }
    );

    console.log(
      "EXPENSE RESPONSE:",
      response.data
    );

    alert("Expense Added");

    setAmount("");

    fetchExpenses();

    fetchAIInsights();

  } catch (err) {

    console.log(
      "FULL ERROR:",
      err
    );

    console.log(
      "RESPONSE:",
      err.response
    );

    alert(
      JSON.stringify(
        err.response?.data ||
        err.message
      )
    );
  }
};

  // =========================
  // DELETE EXPENSE
  // =========================

  const deleteExpense = async (id) => {

    try {

      await axios.delete(
        `http://localhost:8000/expense/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      fetchExpenses();

      fetchAIInsights();

    } catch (err) {

      console.log(err);

    }
  };

  // =========================
  // CALCULATIONS
  // =========================

  const totalExpenses =
    expenses.reduce(
      (acc, item) =>
        acc + item.amount,
      0
    );

  const savings =
    salary
      ? salary - totalExpenses
      : 0;

  // =========================
  // MENU
  // =========================

  const menuItems = [
    "Dashboard",
    "Expenses",
    "Analytics",
    "AI Insights",
  ];

  return (

    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">

        <div>

          <h1 className="text-3xl font-bold mb-2 text-cyan-400">
            FinPilot AI
          </h1>

          <p className="text-slate-400 mb-8">
            Smart Finance Assistant
          </p>

          <div className="space-y-3">

            {menuItems.map((item) => (

              <button
                key={item}
                onClick={() =>
                  setActiveTab(item)
                }
                className={`
                  w-full
                  text-left
                  px-4
                  py-3
                  rounded-xl
                  transition-all
                  duration-300
                  ${
                    activeTab === item
                      ? "bg-cyan-500"
                      : "bg-slate-800 hover:bg-slate-700"
                  }
                `}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        <button
          className="
            w-full
            py-3
            rounded-xl
            bg-red-500
            hover:bg-red-600
          "
          onClick={() => {

            localStorage.removeItem("token");

            window.location.reload();

          }}
        >
          Logout
        </button>

      </div>

      {/* MAIN */}

      <div className="flex-1 p-8">

        {/* DASHBOARD */}

        {activeTab === "Dashboard" && (

          <>

            <h1 className="text-5xl font-bold mb-3">
              Financial Dashboard
            </h1>

            <p className="text-slate-400 mb-8">
              AI-powered finance management
            </p>

            {/* CARDS */}

            <div className="grid grid-cols-4 gap-6 mb-8">

              <div className="bg-slate-900 p-6 rounded-2xl">

                <h2 className="text-slate-400 mb-2">
                  Monthly Salary
                </h2>

                <p className="text-3xl font-bold text-cyan-400">
                  ₹{salary || 0}
                </p>

              </div>

              <div className="bg-slate-900 p-6 rounded-2xl">

                <h2 className="text-slate-400 mb-2">
                  Expenses
                </h2>

                <p className="text-3xl font-bold text-red-400">
                  ₹{totalExpenses}
                </p>

              </div>

              <div className="bg-slate-900 p-6 rounded-2xl">

                <h2 className="text-slate-400 mb-2">
                  Savings
                </h2>

                <p className="text-3xl font-bold text-green-400">
                  ₹{savings}
                </p>

              </div>

              <div className="bg-slate-900 p-6 rounded-2xl">

                <h2 className="text-slate-400 mb-2">
                  Goal
                </h2>

                <p className="text-3xl font-bold text-yellow-400">
                  ₹{goal || 0}
                </p>

              </div>

            </div>

            {/* CONTENT */}

            <div className="grid grid-cols-2 gap-8">

              {/* ADD EXPENSE */}

              <div className="bg-slate-900 p-6 rounded-2xl">

                <h2 className="text-2xl font-bold mb-6">
                  Add Expense
                </h2>

                <div className="space-y-4">

                  <input
                    type="number"
                    placeholder="Monthly Salary"
                    value={salary}
                    onChange={(e) =>
                      setSalary(e.target.value)
                    }
                    className="
                      w-full
                      p-4
                      rounded-xl
                      bg-slate-800
                    "
                  />

                  <input
                    type="number"
                    placeholder="Savings Goal"
                    value={goal}
                    onChange={(e) =>
                      setGoal(e.target.value)
                    }
                    className="
                      w-full
                      p-4
                      rounded-xl
                      bg-slate-800
                    "
                  />

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    className="
                      w-full
                      p-4
                      rounded-xl
                      bg-slate-800
                    "
                  >
                    <option>Food</option>
                    <option>Travel</option>
                    <option>Shopping</option>
                    <option>Bills</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Expense Amount"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                    className="
                      w-full
                      p-4
                      rounded-xl
                      bg-slate-800
                    "
                  />

                  <button
                    onClick={addExpense}
                    className="
                      w-full
                      py-4
                      rounded-xl
                      bg-cyan-500
                      hover:bg-cyan-600
                      font-bold
                    "
                  >
                    Add Expense
                  </button>

                </div>

              </div>

              {/* CHART */}

              <div className="bg-slate-900 p-6 rounded-2xl">

                <h2 className="text-2xl font-bold mb-6">
                  Expense Analytics
                </h2>

                <div className="h-[400px]">

                  {expenses.length > 0 ? (

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <PieChart>

                        <Pie
                          data={expenses}
                          dataKey="amount"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={130}
                          label
                        >

                          {expenses.map(
                            (entry, index) => (

                              <Cell
                                key={index}
                                fill={
                                  COLORS[
                                    index %
                                    COLORS.length
                                  ]
                                }
                              />

                            )
                          )}

                        </Pie>

                        <Tooltip />

                      </PieChart>

                    </ResponsiveContainer>

                  ) : (

                    <div className="
                      flex
                      items-center
                      justify-center
                      h-full
                      text-slate-400
                    ">
                      No expense data available
                    </div>

                  )}

                </div>

              </div>

            </div>

          </>

        )}

        {/* EXPENSES */}

        {activeTab === "Expenses" && (

          <>

            <h1 className="text-5xl font-bold mb-8">
              Expenses
            </h1>

            <div className="bg-slate-900 rounded-2xl p-6">

              <table className="w-full">

                <thead>

                  <tr className="text-slate-400">

                    <th className="text-left pb-4">
                      Category
                    </th>

                    <th className="text-left pb-4">
                      Amount
                    </th>

                    <th className="text-left pb-4">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {expenses.map((item) => (

                    <tr
                      key={item.id}
                      className="
                        border-t
                        border-slate-800
                      "
                    >

                      <td className="py-4">
                        {item.category}
                      </td>

                      <td>
                        ₹{item.amount}
                      </td>

                      <td>

                        <button
                          onClick={() =>
                            deleteExpense(item.id)
                          }
                          className="
                            bg-red-500
                            px-4
                            py-2
                            rounded-lg
                          "
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </>

        )}

        {/* ANALYTICS */}

        {activeTab === "Analytics" && (

          <>

            <h1 className="text-5xl font-bold mb-8">
              Analytics
            </h1>

            <div className="bg-slate-900 p-6 rounded-2xl">

              <div className="h-[500px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={expenses}
                      dataKey="amount"
                      nameKey="category"
                      outerRadius={170}
                      label
                    >

                      {expenses.map(
                        (entry, index) => (

                          <Cell
                            key={index}
                            fill={
                              COLORS[
                                index %
                                COLORS.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

          </>

        )}

        {/* AI INSIGHTS */}

        {activeTab === "AI Insights" && (

          <>

            <h1 className="text-5xl font-bold mb-8">
              AI Insights
            </h1>

            <div className="space-y-6">

              {aiInsights.map(
                (item, index) => (

                  <div
                    key={index}
                    className="
                      bg-slate-900
                      p-6
                      rounded-2xl
                      border
                      border-cyan-500
                      text-lg
                    "
                  >
                    {item}
                  </div>

                )
              )}

            </div>

          </>

        )}

      </div>

    </div>

  );
}
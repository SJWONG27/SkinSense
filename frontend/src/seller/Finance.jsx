import React from 'react';
//import '../App.css'
import "../styles/index.css"

class Finance extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state for finance data
    this.state = {
      transactions: [
        { id: 1, date: '2024-04-15', description: 'Sale of Product A', amount: 100 },
        { id: 2, date: '2024-04-16', description: 'Sale of Product B', amount: 150 },
        { id: 3, date: '2024-04-17', description: 'Sale of Product C', amount: 200 },
      ],
      totalEarnings: 450,
      totalWithdrawn: 0,
      balance: 450
    };
  }

  handleWithdraw = () => {
    // Perform withdrawal logic, for example, deducting from balance
    // For simplicity, we'll just set totalWithdrawn to totalEarnings
    this.setState(prevState => ({
      totalWithdrawn: prevState.totalEarnings,
      balance: 0
    }));
  }

  render() {
    const { transactions, totalEarnings, totalWithdrawn, balance } = this.state;

    return (
      <div className='Finance'>
        <div className='pagetitle'><h2>Finance Page</h2></div>

        <div className='finance-summary1'>
          <h3>Summary</h3>
          <div className='finance-summary2'>
            <div className='finance-sd'><p>Total Earnings: <p>RM {totalEarnings}</p></p></div>
            <div className='finance-sd'><p>Total Withdrawn: <p>RM {totalWithdrawn}</p></p></div>
            <div className='finance-sd'><p>Balance Left: <p>RM {balance} </p></p></div>
          </div>
          <button onClick={this.handleWithdraw}>Withdraw</button>
        </div>

        <div className='finance-transactions'>
          <h3>Transactions</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    );
  }
}

export default Finance;
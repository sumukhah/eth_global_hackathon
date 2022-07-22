const { connect } = require("@tableland/sdk");

const writeTable = async (sqlInsertStatements) => {
  const tableland = await connect({
    network: "testnet",
    chain: "polygon-mumbai",
  });

  console.log(`Writing metadata to tables...`);
  for await (let statement of sqlInsertStatements) {
    const { main, attributes } = statement;

    // Call 'write' with both INSERT statements; optionally, log it to show some SQL queries
    await tableland.write(main);
    console.log(`Main table: ${main}`);
    // Recall that `attributes` is an array of SQL statements for each `trait_type` and `value` for a `tokenId`
    for await (let attribute of attributes) {
      await tableland.write(attribute);
      console.log(`Attributes table: ${attribute}`);
    }
  }
};

export default writeTable;

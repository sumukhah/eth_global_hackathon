// const prepareMetadata = require("./useUploadMetadataToIpfs").default;
const defaultMetadata = [
  {
    id: 1,
    name: "TableNFT Rigs #0",
    description: "A Tableland NFT demo -- deploying metadata on Tableland",
    image:
      "https://bafkreibijrzbzy44dxmroq7jvbtka4oxgrejdtzsgu2qqsiugeb3he56pi.ipfs.nftstorage.link/",
    attributes: [
      {
        trait_type: "Fleet",
        value: "Foils",
      },
      {
        trait_type: "Role",
        value: "Admin",
      },
    ],
  },
];

export default async (
  mainTable,
  attributesTable,
  metadata = defaultMetadata
) => {
  // debugger;
  // const [balance, setBalance] = useState({ inWei: 0, formatted: 0 });

  // Prepare the metadata (handles all of the IPFS-related actions & JSON parsing).
  // const metadata = await prepareMetadata();

  // An array to hold interpolated SQL INSERT statements, using the metadata object's values.
  const sqlInsertStatements = [];
  for await (let obj of metadata) {
    // Destructure the metadata values from the passed object
    const { id, name, description, image, attributes } = obj;
    // INSERT statement for a 'main' table that includes some shared data across any NFT
    // Schema: id int, name text, description text, image text
    let mainTableStatement = `INSERT INTO ${mainTable} (id, name, description, image) VALUES (${id}, '${name}', '${description}', '${image}');`;
    // Iterate through the attributes and create an INSERT statment for each value, pushed to `attributesTableStatements`
    const attributesTableStatements = [];
    for await (let attribute of attributes) {
      // Get the attirbutes trait_type & value;
      const { trait_type, value } = attribute;
      // INSERT statement for a separate 'attributes' table that holds attribute data, keyed by the NFT tokenId
      // Schema: id int, trait_type text, value text
      const attributesStatement = `INSERT INTO ${attributesTable} (id, trait_type, value) VALUES (${id},'${trait_type}', '${value}');`;
      attributesTableStatements.push(attributesStatement);
    }

    // Prepare the statements as a single 'statement' object
    const statement = {
      main: mainTableStatement,
      attributes: attributesTableStatements,
    };
    console.log(statement);
    // Note the need above to stringify the attributes
    sqlInsertStatements.push(statement);
  }

  // Return the final prepare array of SQL INSERT statements
  return sqlInsertStatements;
};

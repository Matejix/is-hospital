import oracledb from "oracledb";
import * as dotenv from "dotenv";

// get .env config
dotenv.config({ path: "../.env" });
const connectionDBConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=${process.env.DB_HOST})(Port=${process.env.DB_PORT}))(CONNECT_DATA=(SID=${process.env.DB_SID})))`,
};
oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsBuffer = [oracledb.BLOB];

try {
  // initialize oracle's JAVA client
  oracledb.initOracleClient({ libDir: "./instantclient_21_7" });
} catch (error) {
  console.warn("Error has ocurred during oracle's client initialization!");
  console.error(error);
}

async function getDBConnection() {
  try {
    // connect to server and return connection
    return await oracledb.getConnection(connectionDBConfig);
  } catch (error) {
    console.warn("Can't connect to Oracle DB server");
    console.error(error);
  }
}

export default getDBConnection;

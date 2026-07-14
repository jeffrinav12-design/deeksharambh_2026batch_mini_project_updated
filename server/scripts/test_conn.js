import mongoose from 'mongoose';

async function testConnections() {
  const uri = `mongodb://deeksharambh:deeksharambh123@ac-bajpclc-shard-00-00.2z8zfxy.mongodb.net:27017/deeksharambh?ssl=true&authSource=admin&appName=Cluster0`;
  console.log(`Connecting to: ${uri}`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`\n✅ CONNECTION SUCCESSFUL!\n`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    process.exit(1);
  }
}

testConnections();

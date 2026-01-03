try {
  require.resolve("@qupid/config/eslint-preset");
  console.log("Resolve Success");
  require("@qupid/config/eslint-preset");
  console.log("Require Success");
} catch (e) {
  console.error(e);
}

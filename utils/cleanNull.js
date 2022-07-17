module.exports = {
  cleanNull: (arg, datatype) => {
    const match = {
      string: "",
      number: 0,
      boolean: false,
      array: [],
    };

    if (![undefined, null].includes(arg)) return arg;

    if (datatype in match) return match[datatype];
    else return "";
  },
};

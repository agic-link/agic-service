module.exports = {
    isBlank: function (input) {
        return input == null || /^\s*$/.test(input) || input === '';
    },
    isNotBlank: function (input) {
        return !this.isBlank(input);
    },
    shortenKey: function (input) {
        return input.substring(0, 6) + "..." + input.substring(38);
    }
}
export default class Utils {
    static toFixed(num, fixed) {
        var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }

    static rnd(min, max) {
        return Math.random() * (max - min) + min;
    }
}
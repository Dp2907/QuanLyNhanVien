export class Validation {
  constructor() {}

  null(value, selectorError, name) {
    if (value === "") {
      document.querySelector(selectorError).innerHTML =
        name + " không được bỏ trống!";
      return false;
    }
    document.querySelector(selectorError).innerHTML = "";
    return true;
  }

  length(value, selectorError, name, min, max) {
    if (value.length >= min && value.length <= max) {
      document.querySelector(selectorError).innerHTML = "";
      return true;
    }
    document.querySelector(selectorError).innerHTML =
      "Độ dài của " +
      name.toLowerCase() +
      " phải trong khoảng từ " +
      min +
      " đến " +
      max;
    return false;
  }

  number(value, selectorError, name) {
    const num = /^[\d]+$/;
    if (num.test(value)) {
      document.querySelector(selectorError).innerHTML = "";
      return true;
    }
    document.querySelector(selectorError).innerHTML =
      "Tất cả ký tự của " + name.toLowerCase() + " phải là số";
    return false;
  }

  letter(value, selectorError, name) {
    const letters = /^[A-Za-z\s]+$/;
    if (letters.test(value)) {
      document.querySelector(selectorError).innerHTML = "";
      return true;
    }
    document.querySelector(selectorError).innerHTML = name + " phải là chữ";
    return false;
  }

  valueBetween(value, selectorError, name, min, max) {
    if ((value >= min) & (value <= max)) {
      document.querySelector(selectorError).innerHTML = "";
      return true;
    }
    document.querySelector(selectorError).innerHTML =
      name + " phải nằm trong khoảng từ " + min + " đến " + max;
    return false;
  }
}

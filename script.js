'use strict';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    let timerSeconds = Number(this.props.timerSeconds);
    this.state = {
      timerSeconds: timerSeconds,
      //Количество секунд до окончания
      timerString: this.toHHMMSS(timerSeconds),
      //Секунды в формате hh:mm:ss
      controlBtn: 'Start',
      //
      correctAnswers: this.props.correntAnswers || 0 //Правильные ответы

    };
    this.startTimer();
  } //Принимает секунды. Возвращает время в формате hh:mm:ss


  toHHMMSS(s) {
    let hours = Math.floor(s / 3600);
    let minutes = Math.floor(s / 60) % 60;
    let seconds = s % 60;
    return [hours, minutes, seconds].map(v => v < 10 ? '0' + v : v).join(':');
  } //Включает таймер и обновляет состояние


  startTimer() {
    let timerId = setInterval(() => {
      if (!this.state.timerSeconds) {
        //Если время вышло, то остановить таймер и сообщить родительскому компоненту
        clearInterval(timerId);
        this.props.end();
        return;
      }

      let currentSeconds = this.state.timerSeconds - 1;
      this.setState({
        timerSeconds: currentSeconds,
        timerString: this.toHHMMSS(currentSeconds)
      });
    }, 1000);
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "timer"
    }, this.state.timerString));
  }

}

function Welcome(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "wrapper item welcome"
  }, /*#__PURE__*/React.createElement("h2", null, "\u0422\u0440\u0435\u043D\u0430\u0436\u0435\u0440 \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u0442\u0438\u043F\u043E\u0432 \u0432 JavaScript"), /*#__PURE__*/React.createElement(SelectTimer, null), /*#__PURE__*/React.createElement("div", {
    className: "wrapper interface"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: props.handler,
    className: "button"
  }, "\u0421\u0442\u0430\u0440\u0442"))));
}

function Goodbuy(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "wrapper item"
  }, /*#__PURE__*/React.createElement("p", null, "\u0412\u0440\u0435\u043C\u044F \u0432\u044B\u0448\u043B\u043E. \u0412\u0430\u0448 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442:  ", /*#__PURE__*/React.createElement("span", null, props.correct), /*#__PURE__*/React.createElement("br", null), "\u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u043F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430 \u043D\u0430\u0436\u0430\u0432 \u043A\u043D\u043E\u043F\u043A\u0443 \u0441\u043D\u0438\u0437\u0443."), /*#__PURE__*/React.createElement("div", {
    className: "wrapper interface"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: props.handler,
    className: "button"
  }, "\u0421\u0442\u0430\u0440\u0442"))), /*#__PURE__*/React.createElement("div", {
    className: "wrapper item results"
  }, props.expressions.map((e, i) => {
    return /*#__PURE__*/React.createElement("div", {
      className: e.isCorrectUserAnswer ? 'correct' : 'incorrect',
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "wrapper expression"
    }, /*#__PURE__*/React.createElement("span", {
      className: "operandOne"
    }, typeof e.l === 'string' ? '"' + e.l + '"' : String(e.l)), /*#__PURE__*/React.createElement("span", {
      className: "operator"
    }, String(e.o)), /*#__PURE__*/React.createElement("span", {
      className: "operandTwo"
    }, typeof e.r === 'string' ? '"' + e.r + '"' : String(e.r))), /*#__PURE__*/React.createElement("div", {
      className: "wrapper userAnswer"
    }, /*#__PURE__*/React.createElement("span", null, "\u0412\u0430\u0448 \u043E\u0442\u0432\u0435\u0442: ", /*#__PURE__*/React.createElement("b", null, String(e.userAnswer)))));
  })));
} // Создает select для установки таймера (используется в компоненте Welcome)


function SelectTimer(props) {
  function getOptions(n) {
    /* возвращает массив option 24 для часов, 60 для минут и секунд*/
    let options = [];

    for (let i = 0; i < n; i++) {
      let optionElement = /*#__PURE__*/React.createElement("option", {
        key: i
      }, i);
      options.push(optionElement);
    }

    return options;
  }

  let lableHours = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("select", {
    name: "hours",
    id: "selectHours"
  }, getOptions(24)), /*#__PURE__*/React.createElement("label", {
    htmlFor: "selectHours"
  }, "\u0447"));
  let lableMinutes = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("select", {
    name: "minutes",
    id: "selectMinutes"
  }, getOptions(60)), /*#__PURE__*/React.createElement("label", {
    htmlFor: "selectMInutes"
  }, "\u043C"));
  let lableSeconds = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("select", {
    name: "seconds",
    id: "selectSeconds"
  }, getOptions(60)), /*#__PURE__*/React.createElement("label", {
    htmlFor: "selectSeconds"
  }, "c"));
  return /*#__PURE__*/React.createElement("div", {
    className: "wrapper select"
  }, /*#__PURE__*/React.createElement("form", {
    name: "formWelcome"
  }, lableHours, lableMinutes, lableSeconds));
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.operators = ['===', '==', '<=', '>=', '<', '>'];
    this.operands = [undefined, null, NaN, false, true, 0, '', 1, '0', 'orange', 'lime'];
    this.expressions = []; //Хранит все выражения

    this.correct = 0; //Хранит количество правильных ответов

    this.statusApp = 'start'; //Определяет состояние приложения: 'start', 'continue', 'end'

    this.handleButtonTrue = this.handleButtonTrue.bind(this); //привязать контекст обработчиков событий к компоненту

    this.handleButtonFalse = this.handleButtonFalse.bind(this); //

    this.handleButtonStart = this.handleButtonStart.bind(this); //

    this.end = this.end.bind(this); //будет передан дочернему компоненту, чтобы он мог дать сигнал родительскому компоненту
  } //=====  Handlers  =====


  handleButtonTrue(e) {
    let isCorrectUserAnswer = false;

    if (this.state.result === true) {
      this.correct++;
      isCorrectUserAnswer = true;
    }

    this.saveExpression(true, isCorrectUserAnswer);
    this.makeNewExpression();
    e.preventDefault(); //отменить отправку формы
  }

  handleButtonFalse(e) {
    let isCorrectUserAnswer = false;

    if (this.state.result === false) {
      this.correct++;
      isCorrectUserAnswer = true;
    }

    this.saveExpression(false, isCorrectUserAnswer);
    this.makeNewExpression();
    e.preventDefault(); //отменить отправку формы
  } //Запускает тренажер


  handleButtonStart(e) {
    this.statusApp = 'continue';
    this.correct = 0; //сбросить счетчик правильных ответов

    this.expressions = []; //очистить массив сохраненных выражений

    if (this.timerSeconds === undefined) this.timerSeconds = this.getTimerSeconds();
    this.makeNewExpression();
    e.preventDefault(); //отменить отправку формы
  } //=====  Methods  =====
  //Завершает работу тренажера (его нужно привязать к этому компоненту и передать дочернему)


  end() {
    this.statusApp = 'end';
    this.setState({}); //Вызов фиктивного обновления состояния для обновления пользовательского интерфейса после окончания таймера
  } //Получить случайный индекс для выбора операндов и оператора


  getRandomIndex(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  } //Получить случайный операнд из набора


  getOperand() {
    let index = this.getRandomIndex(0, this.operands.length - 1);
    let operand = this.operands[index];
    return operand;
  } //Получить случайный оператор из набора


  getOperator() {
    let index = this.getRandomIndex(0, this.operators.length - 1);
    let operator = this.operators[index];
    return operator;
  } //Получить результат выражения l - левый операнд, r - правый операнд, o - оператор


  getResult(l, r, o) {
    switch (o) {
      case '===':
        return l === r;

      case '==':
        return l == r;

      case '<=':
        return l <= r;

      case '>=':
        return l >= r;

      case '<':
        return l < r;

      case '>':
        return l > r;
    }
  } //Создает новое выражение и обновляет состояние


  makeNewExpression() {
    let leftOperand = this.getOperand();
    let rightOperand = this.getOperand();
    let operator = this.getOperator();
    let result = this.getResult(leftOperand, rightOperand, operator); //'короткие свойства' для упращения записи свойств

    this.setState({
      leftOperand,
      rightOperand,
      operator,
      result
    });
  } //Сохранить выражение, верный ответ и ответ пользователя (будет передан компоненту Goodbuy)


  saveExpression(userAnswer, isCorrectUserAnswer) {
    let e = {
      l: this.state.leftOperand,
      r: this.state.rightOperand,
      o: this.state.operator,
      userAnswer,
      isCorrectUserAnswer
    };
    this.expressions.push(e);
  }
  /* Возвращает время таймера в секундах */


  getTimerSeconds() {
    let form = document.forms.formWelcome;
    let hours = Number(form.hours.value);
    let minutes = Number(form.minutes.value);
    let seconds = Number(form.seconds.value);
    seconds += minutes * 60 + hours * 60 * 60;
    return seconds;
  }

  render() {
    //'деструктуризация объекта' для упрощения обращения к переменным
    let {
      leftOperand: l,
      rightOperand: r,
      operator: o
    } = this.state; //хранит элемент-React который будет выведен в начале работы приложения

    let startApp = /*#__PURE__*/React.createElement(Welcome, {
      handler: this.handleButtonStart
    }); //хранит элемент-React который будет показывать пользователю созданные выражения

    let continueApp = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "wrapper item"
    }, /*#__PURE__*/React.createElement(Timer, {
      end: this.end,
      timerSeconds: this.timerSeconds
    })), /*#__PURE__*/React.createElement("div", {
      className: "wrapper item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "wrapper expression"
    }, /*#__PURE__*/React.createElement("span", {
      className: "operandOne"
    }, typeof l === 'string' ? '"' + l + '"' : String(l)), /*#__PURE__*/React.createElement("span", {
      className: "operator"
    }, String(o)), /*#__PURE__*/React.createElement("span", {
      className: "operandTwo"
    }, typeof r === 'string' ? '"' + r + '"' : String(r))), /*#__PURE__*/React.createElement("div", {
      className: "wrapper interface"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: this.handleButtonTrue,
      className: "button"
    }, "True"), /*#__PURE__*/React.createElement("button", {
      onClick: this.handleButtonFalse,
      className: "button"
    }, "False")))); //хранит элемент-React который будет выведен в конце работы приложения

    let endApp = /*#__PURE__*/React.createElement(Goodbuy, {
      handler: this.handleButtonStart,
      correct: this.correct,
      expressions: this.expressions
    });

    switch (this.statusApp) {
      case 'start':
        return startApp;

      case 'continue':
        return continueApp;

      case 'end':
        return endApp;
    }
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'));

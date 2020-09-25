'use strict';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    let timerSeconds = Number(this.props.timerSeconds);
    this.state = {
      timerSeconds: timerSeconds,
      //Количество секунд до окончания
      timerString: this.getTimerString(timerSeconds),
      //Секунды в формате hh:mm:ss
      controlBtn: 'Start',
      //
      correctAnswers: this.props.correntAnswers || 0 //Правильные ответы

    };
    this.startTimer();
  } //Принимает секунды. Возвращает время в формате hh:mm:ss


  getTimerString(s) {
    if (s > 60) {
      let seconds = s % 60;
      let minutes = Math.floor(s / 60);
      let hours = Math.floor(minutes / 60);
      if (!hours) hours = '00:';else if (hours < 10) hours = '0' + hours + ':';else hours = hours + ':';
      if (!minutes) minutes = '00:';else if (minutes < 10) minutes = '0' + minutes + ':';else minutes = minutes + ':';
      if (!seconds) seconds = '00';else if (seconds < 10) seconds = '0' + seconds;
      return hours + minutes + seconds;
    } else {
      if (s < 10) s = '0' + s;
      return String('00:00:' + s);
    }
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
        timerString: this.getTimerString(currentSeconds)
      });
    }, 1000);
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, this.state.timerString));
  }

}

function Welcome(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "welcome"
  }, /*#__PURE__*/React.createElement("h2", null, "\u0422\u0440\u0435\u043D\u0430\u0436\u0435\u0440 \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u0442\u0438\u043F\u043E\u0432 \u0432 JavaScript"), /*#__PURE__*/React.createElement("form", null, /*#__PURE__*/React.createElement("button", {
    onClick: props.handler
  }, "\u041D\u0430\u0447\u0430\u0442\u044C"))));
}

function Goodbuy(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "goodbuy"
  }, /*#__PURE__*/React.createElement("p", null, "\u0412\u0440\u0435\u043C\u044F \u0432\u044B\u0448\u043B\u043E. \u0412\u0430\u0448 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442:  ", /*#__PURE__*/React.createElement("span", null, props.correct), /*#__PURE__*/React.createElement("br", null), "\u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u043F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430 \u043D\u0430\u0436\u0430\u0432 \u043A\u043D\u043E\u043F\u043A\u0443 \u0441\u043D\u0438\u0437\u0443."), /*#__PURE__*/React.createElement("form", null, /*#__PURE__*/React.createElement("button", {
    onClick: props.handler
  }, "\u041D\u0430\u0447\u0430\u0442\u044C"))), /*#__PURE__*/React.createElement("div", {
    className: "results"
  }, props.expressions.map((e, i) => {
    return /*#__PURE__*/React.createElement("div", {
      className: e.isCorrectUserAnswer ? 'correct' : 'incorrect',
      key: i
    }, /*#__PURE__*/React.createElement("p", {
      className: "expression"
    }, /*#__PURE__*/React.createElement("span", {
      className: "operandOne"
    }, typeof e.l === 'string' ? '"' + e.l + '"' : String(e.l)), /*#__PURE__*/React.createElement("span", {
      className: "operator"
    }, String(e.o)), /*#__PURE__*/React.createElement("span", {
      className: "operandTwo"
    }, typeof e.r === 'string' ? '"' + e.r + '"' : String(e.r))), /*#__PURE__*/React.createElement("p", {
      className: "userAnswer"
    }, "\u0412\u0430\u0448 \u043E\u0442\u0432\u0435\u0442: ", /*#__PURE__*/React.createElement("b", null, String(e.userAnswer))));
  })));
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

    this.end = this.end.bind(this); //будет передат дочернему компоненту, чтобы он мог дать сигнал родительскому компоненту
  } //=====  lifecycle  =====


  componentDidMount() {
    this.makeNewExpression();
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

    this.expressions = [];
    this.makeNewExpression();
    e.preventDefault(); //отменить отправку формы
  } //=====  Methods  =====
  //Завершает работу тренажера (его нужно привязать к этому компоненту и передать дочернему)


  end() {
    this.statusApp = 'end';
    this.makeNewExpression();
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
      className: "continue"
    }, /*#__PURE__*/React.createElement("p", {
      className: "expression"
    }, /*#__PURE__*/React.createElement("span", {
      className: "operandOne"
    }, typeof l === 'string' ? '"' + l + '"' : String(l)), /*#__PURE__*/React.createElement("span", {
      className: "operator"
    }, String(o)), /*#__PURE__*/React.createElement("span", {
      className: "operandTwo"
    }, typeof r === 'string' ? '"' + r + '"' : String(r))), /*#__PURE__*/React.createElement("form", null, /*#__PURE__*/React.createElement("button", {
      onClick: this.handleButtonTrue
    }, "True"), /*#__PURE__*/React.createElement("button", {
      onClick: this.handleButtonFalse
    }, "False"))), /*#__PURE__*/React.createElement("div", {
      className: "timer"
    }, /*#__PURE__*/React.createElement(Timer, {
      end: this.end,
      timerSeconds: "5"
    }))); //хранит элемент-React который будет выведен в конце работы приложения

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

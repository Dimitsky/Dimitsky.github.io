'use strict';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    
    let timerSeconds = Number(this.props.timerSeconds);
    this.state = {
      timerSeconds: timerSeconds, //Количество секунд до окончания
      timerString: this.toHHMMSS(timerSeconds), //Секунды в формате hh:mm:ss
      controlBtn: 'Start',  //
      correctAnswers: this.props.correntAnswers || 0  //Правильные ответы
    }
    this.startTimer();
  }
  //Принимает секунды. Возвращает время в формате hh:mm:ss
  toHHMMSS(s) {
    let hours = Math.floor(s / 3600);
    let minutes = Math.floor(s / 60) % 60;
    let seconds = s % 60;

    return [hours, minutes, seconds]
      .map( v => v < 10 ? '0' + v : v)
      .join(':');
  }
  //Включает таймер и обновляет состояние
  startTimer() {
    let timerId = setInterval( () => {
      if (!this.state.timerSeconds) { //Если время вышло, то остановить таймер и сообщить родительскому компоненту
        clearInterval(timerId);
        this.props.end();
        return;
      }

      let currentSeconds = this.state.timerSeconds - 1;

      this.setState({
        timerSeconds: currentSeconds,
        timerString: this.toHHMMSS(currentSeconds)
      });
    }, 1000)
  }
  render() {
    return (
      <>
        <div className="timer">
          {this.state.timerString}
        </div>
      </>
    )
  }
}

function Welcome(props) {
  return (
    <>
      <div className="wrapper item welcome">
        <h2>Тренажер преобразования типов в JavaScript</h2>
        <SelectTimer />
        <div className="wrapper interface">
          <button onClick={props.handler} className="button">Старт</button>
        </div>
      </div>
    </>
  )
}

function Goodbuy(props) {
  return (
    <>
      <div className="wrapper item">
        <p>
          Время вышло. Ваш результат:  <span>{props.correct}</span><br />
          Вы можете попробовать снова нажав кнопку снизу.
        </p>
        <div className="wrapper interface">
          <button onClick={props.handler} className="button">Старт</button>
        </div>
      </div>
      <div className="wrapper item results">
        {/* вывести все ответы пользователя */}
        {
          props.expressions.map( (e, i) => {
            return (
              <div className={e.isCorrectUserAnswer ? 'correct' : 'incorrect'} key={i}>
                <div className="wrapper expression">
                  {/* чтобы было видно отличие строки от других типов данных */}
                  <span className="operandOne">{typeof e.l === 'string' ? '"' + e.l + '"' : String(e.l)}</span>
                  <span className="operator">{String(e.o)}</span>
                  <span className="operandTwo">{typeof e.r === 'string' ? '"' + e.r + '"' : String(e.r)}</span>
                </div>
                <div className="wrapper userAnswer">
                  <span>Ваш ответ: <b>{String(e.userAnswer)}</b></span>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

// Создает select для установки таймера (используется в компоненте Welcome)
function SelectTimer(props) {
  function getOptions(n) {  /* возвращает массив option 24 для часов, 60 для минут и секунд*/
    let options = [];

    for(let i = 0; i < n; i++) {
      let optionElement = <option key={i}>{i}</option>

      options.push(optionElement);
    }

    return options;
  } 

  let lableHours = (
    <>
      <select name="hours" id="selectHours">
        {getOptions(24)}
      </select>
      <label htmlFor="selectHours">ч</label>
    </>
  );
  let lableMinutes = (
    <>
      <select name="minutes" id="selectMinutes">
        {getOptions(60)}
      </select>
      <label htmlFor="selectMInutes">м</label>
    </>
  );
  let lableSeconds = (
    <>
      <select name="seconds" id="selectSeconds">
        {getOptions(60)}
      </select>
      <label htmlFor="selectSeconds">c</label>
    </>
  );

  return (
    <div className="wrapper select">
      <form name="formWelcome">
        {lableHours}
        {lableMinutes}
        {lableSeconds}
      </form>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {};
    this.operators = [
      '===',
      '==',
      '<=',
      '>=',
      '<',
      '>'
    ];
    this.operands = [
      undefined,
      null,
      NaN,
      false,
      true,
      0,
      '',
      1,
      '0',
      'orange',
      'lime'
    ];
    this.expressions = [];  //Хранит все выражения
    this.correct = 0; //Хранит количество правильных ответов
    this.statusApp = 'start'; //Определяет состояние приложения: 'start', 'continue', 'end'
    this.handleButtonTrue = this.handleButtonTrue.bind(this); //привязать контекст обработчиков событий к компоненту
    this.handleButtonFalse = this.handleButtonFalse.bind(this); //
    this.handleButtonStart = this.handleButtonStart.bind(this); //

    this.end = this.end.bind(this); //будет передан дочернему компоненту, чтобы он мог дать сигнал родительскому компоненту

  }
  //=====  Handlers  =====
  handleButtonTrue(e) {
    let isCorrectUserAnswer = false;

    if(this.state.result === true) {
      this.correct++;
      isCorrectUserAnswer = true;
    }

    this.saveExpression(true, isCorrectUserAnswer);
    this.makeNewExpression();

    e.preventDefault(); //отменить отправку формы
  }
  handleButtonFalse(e) {
    let isCorrectUserAnswer = false;

    if(this.state.result === false) {
      this.correct++
      isCorrectUserAnswer = true;
    }

    this.saveExpression(false, isCorrectUserAnswer);
    this.makeNewExpression();

    e.preventDefault(); //отменить отправку формы
  }
  //Запускает тренажер
  handleButtonStart(e) {
    this.statusApp = 'continue';
    this.correct = 0;  //сбросить счетчик правильных ответов
    this.expressions = []; //очистить массив сохраненных выражений
    if(this.timerSeconds === undefined) 
      this.timerSeconds = this.getTimerSeconds();
    this.makeNewExpression();

    e.preventDefault(); //отменить отправку формы
  }
  //=====  Methods  =====
  //Завершает работу тренажера (его нужно привязать к этому компоненту и передать дочернему)
  end() {
    this.statusApp = 'end';
    this.setState({});  //Фиктивный вызов обновления состояния для обновления пользовательского интерфейса после окончания таймера
  }
  //Получить случайный индекс для выбора операндов и оператора
  getRandomIndex(min, max) {
    let rand = min + Math.random() * (max + 1 - min);

    return Math.floor(rand);
  }
  //Получить случайный операнд из набора
  getOperand() {
    let index = this.getRandomIndex(0, this.operands.length - 1);
    let operand = this.operands[index];

    return operand;
  }
  //Получить случайный оператор из набора
  getOperator() {
    let index = this.getRandomIndex(0, this.operators.length - 1);
    let operator = this.operators[index];

    return operator;
  }
  //Получить результат выражения l - левый операнд, r - правый операнд, o - оператор
  getResult(l, r, o) {
    switch(o) {
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
  }
  //Создает новое выражение и обновляет состояние
  makeNewExpression() {
    let leftOperand = this.getOperand();
    let rightOperand = this.getOperand();
    let operator = this.getOperator();
    let result = this.getResult(leftOperand, rightOperand, operator);

    //'короткие свойства' для упращения записи свойств
    this.setState({
      leftOperand,
      rightOperand,
      operator,
      result
    });
  }
  //Сохранить выражение, верный ответ и ответ пользователя (будет передан компоненту Goodbuy)
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

    seconds += (minutes * 60) + (hours * 60 * 60);

    return seconds;
  }

  render() {
    //'деструктуризация объекта' для упрощения обращения к переменным
    let {
      leftOperand: l,
      rightOperand: r,
      operator: o
    } = this.state;
    
    //хранит элемент-React который будет выведен в начале работы приложения
    let startApp = (
      <Welcome handler={this.handleButtonStart} />
    );
    //хранит элемент-React который будет показывать пользователю созданные выражения
    let continueApp = (
      <>
        <div className="wrapper item">
          {/* timerSeconds устанавливает таймер (секунд) */}
          <Timer end={this.end} timerSeconds={this.timerSeconds}/>
        </div>
        <div className="wrapper item">
          <div className="wrapper expression">
            <span className="operandOne">{typeof l === 'string' ? '"' + l + '"' : String(l)}</span>
            <span className="operator">{String(o)}</span>
            <span className="operandTwo">{typeof r === 'string' ? '"' + r + '"' : String(r)}</span>
          </div>
            <div className="wrapper interface">
              <button onClick={this.handleButtonTrue} className="button">True</button>
              <button onClick={this.handleButtonFalse} className="button">False</button>
            </div>
        </div>
      </>
    );
    //хранит элемент-React который будет выведен в конце работы приложения
    let endApp = (
      <Goodbuy handler={this.handleButtonStart} correct={this.correct} expressions={this.expressions} />
    );
    
    switch(this.statusApp) {
      case 'start':
        return startApp;
      case 'continue':
        return continueApp;
      case 'end':
        return endApp;
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
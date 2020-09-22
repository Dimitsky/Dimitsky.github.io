'use strict';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    
    let timerSeconds = Number(this.props.timerSeconds);
    this.state = {
      timerSeconds: timerSeconds, //Количество секунд до окончания
      timerString: this.getTimerString(timerSeconds), //Секунды в формате hh:mm:ss
      controlBtn: 'Start',  //
      correctAnswers: this.props.correntAnswers || 0  //Правильные ответы
    }
    this.startTimer();
  }
  //Принимает секунды. Возвращает время в формате hh:mm:ss
  getTimerString(s) {
    if(s > 60) {
      let seconds = s % 60;
      let minutes = Math.floor(s / 60);
      let hours = Math.floor(minutes / 60);
  
      if(!hours)  hours = '00:';
      else if(hours < 10) hours = '0' + hours + ':';
      else hours = hours + ':';
  
      if(!minutes) minutes = '00:';
      else if(minutes < 10)  minutes = '0' + minutes + ':';
      else minutes = minutes + ':';
  
      if(!seconds) seconds = '00';
      else if(seconds < 10) seconds = '0' + seconds;
  
      return hours + minutes + seconds;
    } else {
      if(s < 10) s = '0' + s;
      return String('00:00:' + s);
    }
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
        timerString: this.getTimerString(currentSeconds)
      });
    }, 1000)
  }
  render() {
    return (
      <>
        <p>
          {this.state.timerString}
        </p>
      </>
    )
  }
}

function Welcome(props) {
  return (
    <>
      <div className="welcome">
        <h2>Тренажер преобразования типов в JavaScript</h2>
        <form>
          <button onClick={props.handler}>Начать</button>
        </form>
      </div>
    </>
  )
}

function Goodbuy(props) {
  return (
    <>
      <div className="goodbuy">
        <p>
          Время вышло. Ваш результат:  <span>{props.correct}</span><br />
          Вы можете попробовать снова нажав кнопку снизу.
        </p>
        <form>
          <button onClick={props.handler}>Начать</button>
        </form>
      </div>
      <div className="results">
        {/* вывести все ответы пользователя */}
        {
          props.expressions.map( (e, i) => {
            return (
              <div className={e.isCorrectUserAnswer ? 'correct' : 'incorrect'} key={i}>
                <p className="expression">
                  {/* чтобы было видно отличие строки от других типов данных */}
                  <span className="operandOne">{typeof e.l === 'string' ? '"' + e.l + '"' : String(e.l)}</span>
                  <span className="operator">{String(e.o)}</span>
                  <span className="operandTwo">{typeof e.r === 'string' ? '"' + e.r + '"' : String(e.r)}</span>
                </p>
                <p className="userAnswer">
                  Ваш ответ: <b>{String(e.userAnswer)}</b>
                </p>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      correct: 0
    };
    this.operators = [
      '===',
      '=='
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
      '0'
    ];
    this.expressions = [];  //Хранит все выражения
    this.statusApp = 'start'; //Определяет состояние приложения: 'start', 'continue', 'end'
    this.handleButtonTrue = this.handleButtonTrue.bind(this); //привязать контекст обработчиков событий к компоненту
    this.handleButtonFalse = this.handleButtonFalse.bind(this); //
    this.handleButtonStart = this.handleButtonStart.bind(this); //

    this.end = this.end.bind(this); //будет передат дочернему компоненту, чтобы он мог дать сигнал родительскому компоненту

  }
  //=====  lifecycle  =====
  componentDidMount() {
    this.makeNewExpression();
  }
  //=====  Handlers  =====
  handleButtonTrue(e) {
    let isCorrectUserAnswer = false;

    if(this.state.result === true) {
      this.setState({correct: this.state.correct + 1});
      isCorrectUserAnswer = true;
    }

    this.saveExpression(true, isCorrectUserAnswer);
    this.makeNewExpression();

    e.preventDefault(); //отменить отправку формы
  }
  handleButtonFalse(e) {
    let isCorrectUserAnswer = false;

    if(this.state.result === false) {
      this.setState({correct: this.state.correct + 1});
      isCorrectUserAnswer = true;
    }

    this.saveExpression(false, isCorrectUserAnswer);
    this.makeNewExpression();

    e.preventDefault(); //отменить отправку формы
  }
  //Запускает тренажер
  handleButtonStart(e) {
    this.statusApp = 'continue';
    this.setState({correct: 0});  //сбросить счетчик правильных ответов
    this.makeNewExpression();

    e.preventDefault(); //отменить отправку формы
  }
  //=====  Methods  =====
  //Завершает работу тренажера (его нужно привязать к этому компоненту и передать дочернему)
  end() {
    this.statusApp = 'end';
    this.makeNewExpression();
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
        <div className="continue">
          <p className="expression">
            <span className="operandOne">{typeof l === 'string' ? '"' + l + '"' : String(l)}</span>
            <span className="operator">{String(o)}</span>
            <span className="operandTwo">{typeof r === 'string' ? '"' + r + '"' : String(r)}</span>
          </p>
            <form>
              <button onClick={this.handleButtonTrue}>True</button>
              <button onClick={this.handleButtonFalse}>False</button>
            </form>
        </div>
        <div className="timer">
          {/* timerSeconds устанавливает таймер (секунд) */}
          <Timer end={this.end} timerSeconds="30"/>
        </div>
      </>
    );
    //хранит элемент-React который будет выведен в конце работы приложения
    let endApp = (
      <Goodbuy handler={this.handleButtonStart} correct={this.state.correct} expressions={this.expressions} />
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
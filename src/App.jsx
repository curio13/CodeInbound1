import { useEffect, useState } from 'react';
import './App.css';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      console.log(item);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error getting localStorage item "${key}"`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage item "${key}"`, error);
    }
  };

  return [storedValue, setValue];
}

function App() {
  const [started, setStarted] = useState(false);
  const [ratings, setRatings] = useLocalStorage('surveyRatings', {});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submit,setSubmit] = useState(false);
  const [thankYou, setThankYou] = useState(false);
  const questions = [
    "How satisfied are you with our products? ",
    "How fair are the prices compared to similar retailers? ",
    "How satisfied are you with the value for money of your purchase? ",
    "On a scale of 1-10 how would you recommend us to your friends and family? ",
    "What could we do to improve our service? "
  ];

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if(currentQuestionIndex === questions.length - 1){
      setSubmit(true);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleRatingChange = (rating) => {
    setRatings({
      ...ratings,
      [currentQuestionIndex]: rating
    });
  };

  const handleTextChange = (event) => {
    setRatings({
      ...ratings,
      [currentQuestionIndex]: event.target.value
    });
  };

  const handleSubmit = () => {
    setThankYou(true);
    setSubmit(false);
  };

  useEffect(() => {
    if (thankYou) {
      const timer = setTimeout(() => {
        setStarted(false);
        setThankYou(false);
        setCurrentQuestionIndex(0); 
      }, 5000);
      return () => clearTimeout(timer); 
    }
  }, [thankYou]);

  const renderRatingOptions = (maxRating) => {
    return Array.from({ length: maxRating }, (_, i) => (
      <span
        key={i + 1}
        className={`rating-circle ${ratings[currentQuestionIndex] === i + 1 ? 'selected' : ''}`}
        onClick={() => handleRatingChange(i + 1)}
      >
        {i + 1}
      </span>
    ));
  };

  const renderSubmit = ()=>{
    return (
      <div className='container' >
        <h1 className='sub' > Are u sure u want to submit?</h1>
        <div className="navigation-buttons">
          <button onClick={() => setSubmit(false)}>Go Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    )
  }

  const renderThankYou = () => {
    return (
      <div className='container'>
        <h1>Thank you for your time!</h1>
        <p>We appreciate your feedback. You will be redirected to the welcome screen shortly.</p>
      </div>
    );
  };

  const renderQuestion = () => {
    if (currentQuestionIndex === 4) {
      return (
        <div className='main' >
          <p>{questions[currentQuestionIndex]}</p>
        <textarea
          placeholder="What could we do to improve our service?"
          rows="4"
          cols="50"
          value={ratings[currentQuestionIndex] || ''}
          onChange={handleTextChange}
          />
          </div>
      );
    }

    const maxRating = questions[currentQuestionIndex].includes('1-10') ? 10 : 5;
    return (
      <div className='main' >
        <p>{questions[currentQuestionIndex]}</p>
        <div className="rating-options">
          {renderRatingOptions(maxRating)}
        </div>
      </div>
    );
  };

  if (thankYou) {
    return (
      <div id='root'>
        {renderThankYou()}
      </div>
    );
  }

  if (!started) {
    return (
      <div id="root">
        <div className="container welcome-screen">
          <h1>Welcome!</h1>
          <p>Would you like to rate our website?</p>
          <button onClick={() => setStarted(true)}>Yes</button>
        </div>
      </div>
    );
  }
  return (
    <div id='root'>
      {submit ? (
        renderSubmit()
      ) : (
        <div className="container">
          <div className="header">
            <h1>Customer Survey</h1>
            <span>{currentQuestionIndex + 1}/{questions.length}</span>
          </div>
          {renderQuestion()}
          <div className="navigation-buttons">
            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            <button onClick={handleNext}>
              {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

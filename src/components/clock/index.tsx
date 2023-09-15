import { useEffect, useState } from "react";
const Clock = () => {
    const [time, setTime] = useState({
        minutes: new Date().getMinutes(),
        hours: new Date().getHours(),
        seconds: new Date().getSeconds()
      })
      
      useEffect(() => {
        const intervalId = setInterval(() => {
          const date = new Date();
          setTime({
            minutes: date.getMinutes(),
            hours: date.getHours(),
            seconds: date.getSeconds()
          })
        }, 1000)
    
        return () => clearInterval(intervalId);
      }, [])
    
      const convertToTwoDigit = (number: number) => {
        return number.toLocaleString('en-US', {
          minimumIntegerDigits: 2
        })
      }
    
      return (
        <div className="themed-input">
          <span className="text-semibold">{convertToTwoDigit(time.hours)}:</span>
          <span className="text-semibold">{convertToTwoDigit(time.minutes)}:</span>
          <span className="text-semibold">{convertToTwoDigit(time.seconds)}</span>
          <span className="text-semibold">{time.hours >= 12 ? ' PM' : ' AM'}</span>
        </div>
      );
}
export default Clock;
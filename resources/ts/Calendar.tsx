import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function Calendar() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const last = new Date(year, month, 0).getDate();
    const prevLast = new Date(year, month - 1, 0).getDate();
    const Calendar: number[][] = createCalendar(year, month);

    const onClick = (n: number) => () => {
        const nextMonth = month + n;
        if (12 < nextMonth) {
            setMonth(1);
            setYear(year + 1);
        } else if (nextMonth < 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(nextMonth);
        }
    };

    interface Schedule {
        id: number,
        sch_category: string,
        sch_contents: string,
        sch_date: string,
        sch_time: string,
    };

    const [schedules, setSchedules] = useState<Schedule[]>([]);

    useEffect(() => {
        getPostData();
    }, []);

    const getPostData = () => {
        axios
            .post<Schedule[]>('/api/posts')
            .then((response) => {
                setSchedules(response.data);
                console.log(response.data);
            }).catch(() => {
                console.log('通信に失敗しました');
            });
    };

    let rows: Schedule[] = [];

    schedules.map((post) =>
        rows.push({
            id: post.id,
            sch_category: post.sch_category,
            sch_contents: post.sch_contents,
            sch_date: post.sch_date,
            sch_time: post.sch_time,
        })
    );

    return (
        <Fragment>
            <div className="calendar-header">
                <h1>{`${year}年${month}月`}</h1>
                <div className="calendar-nav">
                    <button onClick={onClick(-1)}>{'<先月'}</button>
                    <button onClick={onClick(1)}>{'翌月>'}</button>
                </div>
            </div>
            <table className="calendar-table">
                <thead>
                    <tr>
                        <th>日</th>
                        <th>月</th>
                        <th>火</th>
                        <th>水</th>
                        <th>木</th>
                        <th>金</th>
                        <th>土</th>
                    </tr>
                </thead>
                <tbody>
                    {Calendar.map((week: number[], i: number) => (
                        <tr key={week.join('')}>
                            {week.map((day: number, j: number) => (
                                <td key={`${i}${j}`} id={day.toString()} >
                                    <div>
                                        <div>
                                            {day > last ? day - last : day <= 0 ? prevLast + day : day}
                                        </div>
                                        <div className="schedule-area">
                                            {rows.map((schedules, k) => (
                                                schedules.sch_date === year + '-' + zeroPadding(month) + '-' + zeroPadding(day) &&
                                                <div className='schedule-title' key={k} id={String(schedules.id)}>{schedules.sch_contents}</div>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );

    function createCalendar(year: number, month: number): number[][] {
        const first = new Date(year, month - 1, 1).getDay()

        return [0,1,2,3,4,5].map((weekIndex) => {
            return[0,1,2,3,4,5,6].map((dayIndex) => {
                const day = dayIndex + 1 + weekIndex * 7
                return day - first
            })
        })
    }

    function zeroPadding(num: number) {
        return('0' + num).slice(-2);
    }
}

export default Calendar;

import React, { Fragment, useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from "@mui/material";
import CreateDialog from './CreateDialog';

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

    const[open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    interface formData {
        id: number,
        sch_category: string,
        sch_contents: string,
        sch_date: string,
        sch_hour: string,
        sch_min: string,
    };


    const [formData, setFormData] = useState<formData>({
        id: 0,
        sch_category: "",
        sch_contents: "",
        sch_date: "",
        sch_hour: "",
        sch_min: "",
    });

    interface Post {
        id: number,
        sch_category: string,
        sch_contents: string,
        sch_date: string,
        sch_hour: string,
        sch_min: string,
    };

    const [post, setPosts] = useState<Post[]>([]);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const key = e.target.name;
        const value = e.target.value;
        const data = { ...formData, [key]: value };
        setFormData({ ...data });
        console.log(data);
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const key = e.target.name;
        const value = e.target.value;
        const data = { ...formData, [key]: value };
        setFormData({ ...data });
        console.log(data);
    };

    const createSchedule = async() => {
        try {
            const res = await axios.post<Post>("/api/posts/create",{
                sch_category: formData.sch_category,
                sch_contents: formData.sch_contents,
                sch_date: formData.sch_date,
                sch_time: formData.sch_hour + ':' + formData.sch_min
            });
            const tempPosts = [...post, res.data];
            setPosts(tempPosts);
            setFormData({
                id: 0,
                sch_category: "",
                sch_contents: "",
                sch_date: "",
                sch_hour: "",
                sch_min: ""
            });
        } catch(error) {
            console.log(error);
        }
    };

    interface editFormData {
        id: number,
        sch_category: string,
        sch_contents: string,
        sch_date: string,
        sch_hour: string,
        sch_min: string,
    };

    const[editFormData, setEditFormData] = useState<editFormData>({
        id: 0,
        sch_category: "",
        sch_contents: "",
        sch_date: "",
        sch_hour: "",
        sch_min: "",
    });

    const[editOpen, setEditOpen] = useState(false);

    function getEditData(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        axios.post('/api/edit', {
            id: e.currentTarget.id
        })
        .then(res => {
            setEditFormData({
                id: res.data.id,
                sch_category: res.data.sch_category,
                sch_contents: res.data.sch_contents,
                sch_date: res.data.sch_date,
                sch_hour: res.data.sch_time.substr(0,2),
                sch_min: res.data.sch_time.substr(3,2),
            });
        })
        .catch(() => {
            console.log('通信に失敗しました');
        })
    };

    const editHandleClickOpen = (schedules: Schedule, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setEditOpen(true);
        getEditData(e);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const handleEditTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const key = e.target.name;
        const value = e.target.value;
        const data = { ...editFormData, [key]: value };
        setEditFormData({ ...data});
        console.log(data);
    };

    const handleEditSelectChange = (e: SelectChangeEvent<string>) => {
        const key = e.target.name;
        const value = e.target.value;
        const data = { ...editFormData, [key]: value };
        setEditFormData({ ...data});
        console.log(data);
    };

    const updateSchedule = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        await axios.post('/api/update', {
            id: editFormData.id,
            sch_category: editFormData.sch_category,
            sch_contents: editFormData.sch_contents,
            sch_date: editFormData.sch_date,
            sch_time: editFormData.sch_hour + ':' + editFormData.sch_min
        })
        .then((res) => {
            setEditFormData(res.data);
        })
        .catch(error => {
            console.log(error);
        })
    };

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
                                <td key={`${i}${j}`} id={day.toString()} onClick={handleClickOpen} >
                                    <div>
                                        {day > last ? day - last : day <= 0 ? prevLast + day : day}
                                    </div>
                                    <div className="schedule-area">
                                        {rows.map((schedules, k) => (
                                            schedules.sch_date === year + '-' + zeroPadding(month) + '-' + zeroPadding(day) &&
                                            <div className='schedule-title' key={k} onClick={(e) => {
                                                e.stopPropagation();
                                                editHandleClickOpen(schedules, e);
                                            }}
                                            >
                                                {schedules.sch_contents}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <CreateDialog open={open}/> */}
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        スケジュール登録
                    </DialogContentText>
                    <TextField margin="dense" id="sch_date" name="sch_date" label="予定日" type="text" fullWidth variant="standard" onChange={handleTextChange}/>
                    <InputLabel id="sch_time_label">時刻</InputLabel>
                        <Select labelId="sch_hour" id="sch_hour_select" name="sch_hour" label="Hour" variant="standard" defaultValue="00" onChange={handleSelectChange}>
                            <MenuItem value="00">00</MenuItem>
                            <MenuItem value="01">01</MenuItem>
                        </Select>
                        <Select labelId="sch_min" id="sch_min_select" name="sch_min" label="Min" variant="standard" defaultValue="00" onChange={handleSelectChange}>
                            <MenuItem value="00">00</MenuItem>
                            <MenuItem value="01">01</MenuItem>
                        </Select>
                    <InputLabel id="sch_category_label">カテゴリー</InputLabel>
                    <Select labelId="sch_category" id="sch_category_select" name="sch_category" label="Category" variant="standard" defaultValue="勉強" onChange={handleSelectChange}>
                        <MenuItem value="勉強">勉強</MenuItem>
                        <MenuItem value="案件">案件</MenuItem>
                        <MenuItem value="テスト">テスト</MenuItem>
                    </Select>
                <TextField margin="dense" id="sch_contents" name="sch_contents" label="内容" type="text" fullWidth variant="standard" onChange={handleTextChange}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button href="/dashboard" onClick={createSchedule}>Schedule</Button>
                </DialogActions>
            </Dialog>

            <Dialog onClose={handleClose} open={editOpen}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        スケジュール更新
                    </DialogContentText>
                    <TextField margin="dense" id="sch_date" name="sch_date" label="予定日" type="text" fullWidth variant="standard" value={editFormData.sch_date} onChange={handleEditTextChange}/>
                    <InputLabel id="sch_time_label">時刻</InputLabel>
                    <Select labelId="sch_hour" id="sch_hour_select" name="sch_hour" label="Hour" variant="standard" value={editFormData.sch_hour} onChange={handleEditSelectChange}>
                        <MenuItem value="00">00</MenuItem>
                        <MenuItem value="01">01</MenuItem>
                    </Select>
                    <Select labelId="sch_min" id="sch_min_select" name="sch_min" label="Min" variant="standard" value={editFormData.sch_min} onChange={handleEditSelectChange}>
                        <MenuItem value="00">00</MenuItem>
                        <MenuItem value="01">01</MenuItem>
                    </Select>
                    <InputLabel id="sch_category">カテゴリー</InputLabel>
                    <Select labelId="sch_category" id="sch_category_select" name="sch_category" label="Category" variant="standard" value={editFormData.sch_category} onChange={handleEditSelectChange}>
                        <MenuItem value="勉強">勉強</MenuItem>
                        <MenuItem value="案件">案件</MenuItem>
                        <MenuItem value="テスト">テスト</MenuItem>
                    </Select>
                    <TextField margin="dense" id="sch_contents" name="sch_contents" label="内容" type="text" fullWidth variant="standard" value={editFormData.sch_contents} onChange={handleEditTextChange}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button href="/dashboard" onClick={updateSchedule}>Subscribe</Button>
                </DialogActions>
            </Dialog>
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
    };

    function zeroPadding(num: number) {
        return('0' + num).slice(-2);
    };
}

export default Calendar;

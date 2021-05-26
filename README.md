# online-chatting
Django framework integrate with Zulip's API




## Usage

| Role | API | Documentation |
| --- | --- | --- |
| Student | GET `?student_netid=test_student` | Student chatting page. |
| Counsellor | GET `?student_netid=test_student&staff_netid=test_staff` | Counsellor chatting page.|
| Counsellor | POST `/leave_room` | Its params are: `staff_netid: str`; `student_netid: str`. Both are required.|
| Supervisor | POST `/join_stream` | Its params are: `staff_netid: str`; `student_netid: str`; `subscribers_netid: List[str]`. All of them are required.|






#### TODO

* Supervisor 
    * /join
    * /send_message
* Leave chatting room
    * delete stream
    * deactivate student (TBC)










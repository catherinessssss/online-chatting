# online-chatting
Django framework integrate with Zulip's API




## Usage

| Role | API | Documentation |
| --- | --- | --- |
| Student | GET `?student_netid=test_student` | Student chatting page. |
| Counsellor | GET `?student_netid=test_student&staff_netid=test_staff` | Counsellor chatting page.|
| Supervisor| GET `?stream_name=test_stream_name&superviosr_netid=test_supervisor`| Supervisor chatting page. |
| Counsellor | POST `/delete_stream` | `staff_netid: str`; <br> `student_netid: str`;<br>|
| Supervisor | POST `/subscribe_stream` | `staff_netid: str`;<br>  `student_netid: str`; <br> `subscribers_netid: List[str];`<br>|
| Supervisor | POST `/unsubscribe_stream` | `staff_netid: str`;<br>  `student_netid: str`; <br> `unsubscribers_netid: List[str];`<br>|






#### TODO

* Supervisor 
    * /join
    * /send_message
* Leave chatting room
    * delete stream
    * deactivate student (TBC)










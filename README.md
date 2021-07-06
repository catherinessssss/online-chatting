# online-chatting
Django framework integrate with Zulip's API




## Usage

| Role | API | Documentation |
| --- | --- | --- |
| Student | GET `student?student_netid=test_student&staff_netid=test_staff` | Student chatting page. |
| Counsellor | GET `counsellor?student_netid=test_student&staff_netid=test_staff` | Counsellor chatting page.|
| Supervisor| GET `stream_room?staff_netid=test_staff_netid&superviosr_netid=test_supervisor`| Supervisor chatting page. |
| Counsellor | POST `/delete_stream` | `staff_netid: str`; <br>|
| Counsellor | POST `/delete_stream_in_topic` | `staff_netid: str`; <br>|
| Supervisor | POST `/subscribe_stream` | `staff_netid: str`;<br>  `subscribers_netid: List[str];`<br>|
| Supervisor | POST `/unsubscribe_stream` | `staff_netid: str`;<br>  `unsubscribers_netid: List[str];`<br>|













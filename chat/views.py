import json
from .utils.zulip import ZulipClient
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


config_file = './.zuliprc'
client = ZulipClient(config_file=config_file)


def _construct_stream_name(student_email: str, staff_email: str):
    return f"{student_email}_{staff_email}"


def index(request):
    try:
        staff_netid = request.GET.get('staff_netid', None)
        student_netid = request.GET.get('student_netid', '21')
        student_email = student_netid + '@zulip.com'

        is_student = True if staff_netid is None else False

        users = client.get_users()
        if is_student == True:
            student = next(
                (user for user in users['members'] if user['email'] == student_email), None)
            if student is None:
                client.create_user(student_email, student_netid)
            key = client.fetch_user_api_key(student_email, student_email)
            page_info = {
                'key': key,
                'is_student': is_student,
                'student_email': student_email,
                'student_netid': student_netid,
            }
        else:
            # Mock data
            staff_netid = '10'
            staff_email = staff_netid + '@zulip.com'
            # TODO no need to create staff user every time
            staff = next(
                (user for user in users['members'] if user['email'] == staff_email), None)
            if staff is None:
                client.create_user(staff_email, staff_netid)

            # We will use `${student_email}_${staff_email}` to construct the stream name.
            stream_name = _construct_stream_name(
                student_netid=student_email, staff_netid=staff_email)
            client.create_stream(stream_name=stream_name, user_ids=[
                                 student_email, staff_email])
            key = client.fetch_user_api_key(staff_email, staff_email)

            page_info = {
                'key': key,
                'is_student': is_student,
                'staff_email': staff_email,
                'staff_netid': staff_netid,
                'stream_name': stream_name,
                'student_email': student_email,
                'student_netid': student_netid,
            }

        return render(request, 'chat/index.html', page_info)
    except Exception as e:
        print(e)


@csrf_exempt
@require_http_methods(['POST'])
def subscribe_stream(request):
    request_data = json.loads(request.body)
    staff_netid = request_data['staff_netid']
    student_netid = request_data['student_netid']
    subscribers = request_data['subscribers_netid']

    staff_email = staff_netid + '@zulip.com'
    student_email = student_netid + '@zulip.com'
    # subscribers = [item + '@zulip.com' for item in subscribers]

    users = client.get_users()
    subscribers_email = []
    for subscriber_netid in subscribers:
        subscriber_email = subscriber_netid + '@zulip.com'

        is_exist = next(
            (user for user in users['members'] if user['email'] == subscriber_email), None)
        if is_exist is None:
            print("subsriber isn't exist, create a new one")
            client.create_user(username=subscriber_email,
                               name=subscriber_netid)

        subscribers_email.append(subscriber_email)

    stream_name = _construct_stream_name(
        student_email=student_email,
        staff_email=staff_email
    )

    try:
        client.subscribe_stream(stream_name=stream_name,
                                subscribers=subscribers_email)
        return JsonResponse({
            'status': 'success',
            'content': {
                'stream_name': stream_name
            }
        })
    except Exception as e:
        return JsonResponse({'status': "error", "error": str(e)})


@csrf_exempt
@require_http_methods(['POST'])
def unsubscribe_stream(request):
    request_data = json.loads(request.body)
    staff_netid = request_data['staff_netid']
    student_netid = request_data['student_netid']
    unsubscribers = request_data['unsubscribers_netid']

    staff_email = staff_netid + '@zulip.com'
    student_email = student_netid + '@zulip.com'

    users = client.get_users()
    subscribers_email = []
    for subscriber_netid in unsubscribers:
        subscriber_email = subscriber_netid + '@zulip.com'

        is_exist = next(
            (user for user in users['members'] if user['email'] == subscriber_email), None)
        if is_exist is None:
            continue

        subscribers_email.append(subscriber_email)

    stream_name = _construct_stream_name(
        student_email=student_email,
        staff_email=staff_email
    )

    try:
        client.unsubscribe_stream(
            stream_name=stream_name, unsubscribers=subscribers_email)
        return JsonResponse({
            'status': 'success',
            'content': {
                'stream_name': stream_name
            }
        })
    except Exception as e:
        return JsonResponse({'status': "error", "error": str(e)})


@csrf_exempt
@require_http_methods(['POST'])
def delete_stream(request):
    request_data = json.loads(request.body)
    staff_netid = request_data['staff_netid']
    student_netid = request_data['student_netid']

    staff_email = staff_netid + '@zulip.com'
    student_email = student_netid + '@zulip.com'

    stream_name = _construct_stream_name(
        student_email=student_email,
        staff_email=staff_email
    )

    try:
        stream_id = client.get_stream_id(stream_name=stream_name)
        result = client.delete_stream(stream_id=stream_id)
        return JsonResponse({
            'status': 'success',
            'content': {
                'stream_name': stream_name
            }
        })
    except Exception as e:
        return JsonResponse({'status': "error", "error": str(e)})

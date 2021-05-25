from typing import List
import zulip
import requests


class ZulipClient:
    def __init__(self, config_file):
        self.client = zulip.Client(config_file=config_file)

    def get_users(self):
        users = self.client.get_users()
        return users


    def create_user(self, username, name):
        data = {
            "email": username,
            "password": username,
            'full_name': name,
            'short_name': name,
        }

        response = self.client.create_user(data)
        if response['result'] == 'error':
            raise Exception('Cannot create user {username}: {error}'.format(username=username, error=response['msg']))

        return True

    def create_stream(self, user_ids: List[str]):
        name = "_".join(user_ids)
        response = self.client.add_subscriptions(
            streams=[
                {"name": name, 
                "description": "Stream for {name}".format(name=name)},
            ],
            principals=user_ids,
        )
        if response['result'] == 'error':
            raise Exception('Cannot subsribe a steam')
        return name


    def fetch_user_api_key(self, username: str, password:str):
        payload = {
            "username": username,
            "password": password,
        }

        # TODO 
        # replace the url
        response = requests.post("https://zulip.cat/api/v1/fetch_api_key", data=payload, verify='./ssl/zulip.combined-chain.crt')
        result = response.json()
        if response.status_code != 200:
            raise Exception("Cannot get {username}'s api key: {error}".format(username=username, error=result.msg))
        
        return result['api_key']


    def get_user_presence(self, email: str):
        response = self.client.get_user_presence(email)
        print(response)
        return 

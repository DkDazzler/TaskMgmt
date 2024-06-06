// This test file will only be use for initial config.
import path from "path";
import { LocalStorage } from "node-localstorage";
const container = require('~/dependency'),
      DateTimeUtil = container.resolve("DateTimeUtil"),
      currentTime = DateTimeUtil.getCurrentTimeObjForDB();

    



describe('Initial test configuration', () => {
    test('setting-up test configuration', () => {
        // constructor function to create a storage directory inside our project for test cases.
        var localStorage = new LocalStorage(path.join(__dirname, 'localStorage'));
        // Setting localStorage Item.
        localStorage.setItem('apiHeader', JSON.stringify(
            {
                'device-id': '12345',
                'device-type': '1',
                'device-token': 'abcxyz',
                'api-key': 'm2E7FFKm3v8e!xCxj|6RAC87lMA2wOFXt8i3HX&klH}?{556dc1kwyllokWzqeKw&kH}?{j7UuFXn55BE508zy7gEHNMx',
                'access-token': ''
            }
        ));

        localStorage.setItem('authUserData', JSON.stringify(
            {
                // set user signup details.
                "userSignupDetails" : {
                    'firstName': 'Test company name',
                    'lastName': 'Test user name',
                    'email': 'test.user@mailinator.com',
                    'password': 'User@123',
                    'cnfPassword': 'User@123'
                }
            }
        ));

        localStorage.setItem('taskData', JSON.stringify(
            {
                // set task details.
                "task" : {
                    'title': 'Test task title',
                    'description': 'Test task description',
                    'status': 'in-progress'
                },
                // set update task details.
                "taskUpdate" : {
                    'title': 'Test task updated title',
                    'description': 'Test task updated description',
                    'status': 'completed'
                }
            }
        ));

        localStorage.setItem('encryptedId', JSON.stringify(
            {
                "id": "lejRej"
            }
        ));
    })
});

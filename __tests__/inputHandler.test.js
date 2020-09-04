import { postDetails } from '../src/client/js/app'
import { getDetailsAndUpdateUI } from '../src/client/js/app'

test('Post request to server file', async() => {
    const data = await postDetails('pune', 5);
    expect(JSON.stringify(data)).toBe('{\"message\":\"Data successfully recieved\"}');
});

test('Get request to get default data from server file', async() => {
    const data = await getDetailsAndUpdateUI();
    expect(JSON.stringify(data)).toMatch('city":"pune","country":"India"');
});
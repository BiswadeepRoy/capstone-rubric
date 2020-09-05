import { getCountry } from '../src/server/server'

test('Post request geoName API to fetch country', async() => {
    const data = await getCountry('pune');
    expect(JSON.stringify(data)).toBe("\"India\"");
});
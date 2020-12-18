export class User{
    user_id: string;
    emails: string;
    names: string;
    usernames: string;
    emailVerified: boolean;
    lat: number;
    lng: number;
    photo_profile: string;
    key: string;

    constructor(
        user_id: string,
        emails: string,
        names: string,
        usernames: string,
        emailVerified: boolean,
        points: {
            quiz_id: string,
            user_point: number,
            user_score: number,
        },
        photo_profile: string,
        key: string) {
    }
}

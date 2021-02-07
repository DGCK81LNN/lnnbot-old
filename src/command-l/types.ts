export type Uint1 = 0 | 1;
export type Int1 = 0 | -1;

export type ResponseWrapper<T> = {
    code: string,
    message?: string,
    msg?: string,
    data?: T,
}

export type VideoViewResponse = {
    bvid?: string,
    aid?: number,
    videos?: number,
    tname?: string,
    copyright?: VideoCopyright,
    pic?: string,
    title?: string,
    pubdate?: number
    ctime?: number,
    desc?: string,
    attribute?: VideoAttribute,
    duration?: number,
    rights?: {
        download?: Uint1,
        movie?: Uint1,
        pay?: Uint1,
        no_reprint?: Uint1,
        is_cooperation?: Uint1,
    },
    owner?: {
        mid?: number,
        name?: string,
        face?: string,
    }
    stat?: {
        aid?: number,
        view?: number,
        danmaku?: number,
        reply?: number,
        favorite?: number,
        coin?: number,
        share?: number,
        now_rank?: number,
        his_rank?: number,
        like?: number,
    }
    dynamic?: string,
    no_cache?: boolean,
    pages?: {
        cid?: number,
        page?: number,
        part?: string,
        duration?: number,
    }[],
    subtitle?: {
        allow_submit?: boolean,
        list?: {
            id?: number,
            lan?: string,
            lan_doc?: string,
            is_lock?: boolean,
            subtitle_url?: string,
            author?: {
                mid?: number,
                name?: string,
                face?: string,
            },
        }[],
    },
    staff?: {
        title?: string,
        mid?: number,
        name?: string,
        face?: string,
    }[],
};
export enum VideoCopyright {
    Original = 1,
    Reprinted = 2,
}
export enum VideoAttribute {
    None = 0,
    Interactive = 1 << 29,
}

export type VideoTagsResponse = {
    tag_id?: number,
    tag_name?: string,
    short_content?: string
}[];


export type UserVip = {
    status: Uint1,
    type: UserVipType,
}
export enum UserVipType { None, Monthly, Annual }
export type UserOfficial = {
    type: Int1,
    role: UserOfficialRole,
    title: string,
    desc: string,
}
export enum UserOfficialRole { None, Celebrity, Identity, Company, Media, Government, Organization }

export type CommentsResponse = {
    cursor?: { all_count?: number },
    top?: { upper: CommentMain<CommentMain> },
    replies?: CommentMain<CommentMain>[],
    hots?: CommentMain<CommentMain>[],
    upper?: { mid?: number }
};
export type CommentMain<T = void> = {
    floor?: number,
    ctime?: number,
    like?: number,
    member?: {
        mid?: number,
        uname?: string,
        avatar?: string,
        level_info?: { current_level: 0 | 1 | 2 | 3 | 4 | 5 | 6 },
        official_verify?: {
            desc: string,
        },
        vip?: {
            vipStatus: Uint1,
            vipType: UserVipType,
        },
    },
    content?: { message?: string },
    rcount?: number,
    replies?: T extends void ? void : T[],
}

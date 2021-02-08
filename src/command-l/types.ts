import { User } from "mirai-ts/dist/types/contact";

export type Uint1 = 0 | 1;
export type Int1 = 0 | -1;

export type ResponseWrapper<T> = {
    code: string,
    message: string,
    msg: string,
    data: T,
};

export type VideoViewResponse = {
    bvid: string,
    aid: number,
    videos: number,
    tname: string,
    copyright: VideoCopyright,
    pic: string,
    title: string,
    pubdate: number
    ctime: number,
    desc: string,
    duration: number,
    rights?: {
        download: Uint1,
        movie: Uint1,
        pay: Uint1,
        no_reprint: Uint1,
        is_stein_gate: Uint1,
        is_cooperation: Uint1,
    },
    owner?: {
        mid: number,
        name: string,
        face: string,
    }
    stat?: {
        aid: number,
        view: number,
        danmaku: number,
        reply: number,
        favorite: number,
        coin: number,
        share: number,
        now_rank: number,
        his_rank: number,
        like: number,
    }
    dynamic: string,
    no_cache: boolean,
    pages?: {
        cid: number,
        page: number,
        part: string,
        duration: number,
    }[],
    subtitle?: {
        allow_submit: boolean,
        list?: {
            id: number,
            lan: string,
            lan_doc: string,
            is_lock: boolean,
            subtitle_url: string,
            author?: {
                mid: number,
                name: string,
                face: string,
            },
        }[],
    },
    staff?: {
        title: string,
        mid: number,
        name: string,
        face: string,
    }[],
};
export enum VideoCopyright {
    Original = 1,
    Reprinted = 2,
}

export type VideoTagsResponse = {
    tag_id: number,
    tag_name: string,
    short_content: string
}[];

export type UserInfoResponse = {
    mid: number,
    name: string,
    face: string,
    sex: string,
    sign: string,
    level: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    silence: Uint1,
    birthday: string,
    fans_badge: boolean,
    official?: { title: string },
    vip?: { type: UserVipType },
    pendant?: { name: string, image: string },
    nameplate?: { name: string, image: string, level: string, condition: string },
    top_photo: string,
    sys_notice?: { content: string, url: string },
    live_room?: {
        roomStatus: Uint1,
        liveStatus: Uint1,
        roundStatus: Uint1,
        url: string,
        title: string,
        cover: string,
        online: number,
        roomis: number,
    }
};
export enum UserVipType { None, Monthly, Annual }

export type UserRelationStatResponse = {
    following: number,
    follower: number,
};

export type UserSpaceVideoResponse = {
    list: {
        vlist: {
            aid: number,
            bvid: string,
            title: string,
            pic: string,
            description: string,
            length: string,
            /** 互动视频 */
            is_steins_gate: Uint1,
            is_union_video: Uint1,
            play: number,
            comment: number,
        }[],
    },
}

/*
export type UserSpaceHistoryResponse = {
    cards?: {
        card: string,
        desc?: {
            type: DynamicType,
            dynamic_id: bigint,
            like: number,
            rid: bigint,
            timestamp: number,
            user_profile: any,
        },
        extra?: { is_space_top: Uint1 },
    }[],
};

export enum DynamicType {
    Repost = 1,
    AlbumPost = 2,
    TextPost = 4,
    VideoPost = 8,
    ArticlePost = 64,
    AudioPost = 256,
    BangumiUpdate = 512,
    AudioPlaylist = 2048,
    VideoPlaylist = 4300,
}
export namespace DynamicCard {
    export type Repost = {
        user: {
            uid: number,
            uname: string,
            face: string,
        },
        item: {
            content: string,
            orig_type: DynamicType,
            orig_dy_id: bigint,
        },
        origin: string,
        origin_user: {
            info: {
                uid: number,
                uname: string,
                face: string,
            },
        },
        bvid?: string,
    };
    export type AlbumPost = {
        item: {
            id: number,
            description: string,
            pictures: {
                img_src: string,
                img_width:number,
                img_height: number,
            }[],
            pictures_count: number,
            upload_time: number,
        },
        user: {
            uid: number,
            head_url: string,
            name: string,
        }
    };
    export type TextPost = {
        user: {
            uid: number,
            uname: string,
            face: string,
        },
        item: {
            content: string,
            timestamp: number,
        }
    };
    export type VideoPost = {
        aid: number,
        copyright: VideoCopyright,
        desc: string,
        duration: number,
        dynamic: string,
        owner: {
            mid: number,
            name: string,
            face: string,
        },
        pic: string,
        pubdate: number,
        stat: {
            coin: number,
            danmaku: number,
            favorite: number,
            like: number,
            reply: number,
            share: number,
            view: number,
        },
        title: string,
        tname: string,
        videos: number,
    };
    export type ArticlePost = {};
    export type Any = Repost | AlbumPost | TextPost | VideoPost | ArticlePost;
}
export type DynamicCardType<T extends number> =
    T extends 1
    ? DynamicCard.Repost
    : T extends 2
    ? DynamicCard.AlbumPost
    : T extends 4
    ? DynamicCard.TextPost
    : T extends 8
    ? DynamicCard.VideoPost
    : T extends 64
    ? DynamicCard.ArticlePost
    : any;
*/
export type CommentsResponse = {
    cursor?: { all_count: number },
    top?: { upper: CommentMain<CommentMain> },
    replies: CommentMain<CommentMain>[],
    hots: CommentMain<CommentMain>[],
    upper?: { mid: number }
};
export type CommentMain<T = void> = {
    floor: number,
    ctime: number,
    like: number,
    member?: {
        mid: number,
        uname: string,
        avatar: string,
        level_info?: { current_level: 0 | 1 | 2 | 3 | 4 | 5 | 6 },
        official_verify?: { desc: string },
        vip?: { vipType: UserVipType },
    },
    content?: { message: string },
    rcount: number,
    replies: T extends void ? void : T[],
};

export type SearchUsernameResponse = {
    content: string,
}
export type SearchUsernameData = {
    result?: {
        mid: number,
        uname: string,
        upic: string,
        level: number,
        fans: number,
    }[],
}

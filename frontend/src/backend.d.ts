import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Comment {
    id: bigint;
    content: string;
    author: Principal;
    timestamp: Time;
    postId: bigint;
}
export interface UserProfile {
    bio?: string;
    displayName: string;
    avatarUrl?: string;
}
export interface Post {
    id: bigint;
    content: string;
    author: Principal;
    imageUrl?: string;
    timestamp: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: bigint, content: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(content: string, imageUrl: string | null): Promise<bigint>;
    getAllPosts(): Promise<Array<Post>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommentsForPost(postId: bigint): Promise<Array<Comment>>;
    getLikeCount(postId: bigint): Promise<bigint>;
    getPost(id: bigint): Promise<Post | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleLike(postId: bigint): Promise<boolean>;
}

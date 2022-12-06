package com.zectan.chatic.Model;

import java.util.List;
import java.util.Map;

public class User {
    private String uid;
    private String usnm;
    private String eml;
    private String pfp;
    private List<String> chatorder;
    private Map<String, Integer> unread;

    public User() {

    }

    /**
     * New user object
     *
     * @param uid       User ID
     * @param usnm      Username
     * @param eml       Email
     * @param pfp       Profile Picture
     * @param chatorder Chat order
     * @param unread    Unread
     */
    public User(String uid, String usnm, String eml, String pfp, List<String> chatorder, Map<String, Integer> unread) {
        this.uid = uid;
        this.usnm = usnm;
        this.eml = eml;
        this.pfp = pfp;
        this.chatorder = chatorder;
        this.unread = unread;
    }

    public String getUid() {
        return uid;
    }

    public String getUsnm() {
        return usnm;
    }

    public String getEml() {
        return eml;
    }

    public String getPfp() {
        return pfp;
    }

    public List<String> getChatorder() {
        return chatorder;
    }

    public Map<String, Integer> getUnread() {
        return unread;
    }
}

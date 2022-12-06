package com.zectan.chatic;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;

public class ChatActivity extends AppCompatActivity {
    FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);

        mAuth = FirebaseAuth.getInstance();
    }

    public void logout(View v) {
        mAuth.signOut();
        Intent login = new Intent(this, LoginActivity.class);
        startActivity(login);
        finish();
    }

}

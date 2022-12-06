package com.zectan.chatic;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;

public class MainActivity extends AppCompatActivity {
    FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mAuth = FirebaseAuth.getInstance();

        // Main activity acts as an Authentication redirecter
        Intent login = new Intent(this, LoginActivity.class);
        Intent chat = new Intent(this, ChatActivity.class);

        if (mAuth.getCurrentUser() == null) {
            startActivity(login);
        } else {
            startActivity(chat);
        }

        finish();
    }
}
package com.zectan.chatic;

import android.animation.Animator;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.TransitionDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.ViewAnimationUtils;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.zectan.chatic.Model.User;

public class LoginActivity extends AppCompatActivity {
    private static final String TAG = "LoginActivity";
    private boolean animating;

    private FirebaseAuth mAuth;
    private FirebaseFirestore firestore;

    private EditText editTextEml;
    private EditText editTextPswd;

    private GoogleSignInFragment googleButton;
    private LoadingButtonFragment loginButton;

    private LinearLayout loginContent;
    /**
     * Show errors via a material design popup
     */
    public OnFailureListener onFailure = (e) -> {
        new MaterialAlertDialogBuilder(loginContent.getRootView().getContext())
                .setTitle("Login Failure")
                .setMessage(e.getMessage())
                .setNeutralButton("Ok", (dialog, which) -> {
                })
                .show();
        if (animating) loginButton.end();
        setAnimating(false);
    };
    private ConstraintLayout expandedView;
    private ImageView pfpImage;
    private TextView usnmText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right);
        animating = false;

        mAuth = FirebaseAuth.getInstance();
        firestore = FirebaseFirestore.getInstance();

        editTextEml = findViewById(R.id.login_edit_text_eml);
        editTextPswd = findViewById(R.id.login_edit_text_pswd);

        googleButton = new GoogleSignInFragment();
        loginButton = new LoadingButtonFragment();

        loginContent = findViewById(R.id.login_content);

        expandedView = findViewById(R.id.login_expand_button);
        pfpImage = findViewById(R.id.login_expand_pfp);
        usnmText = findViewById(R.id.login_expand_usnm);

        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.sign_in_google, googleButton)
                .replace(R.id.login_button, loginButton)
                .commit();
    }

    public void toForgotPassword(View v) {
        if (animating) return;
        Toast.makeText(this, "Forgot password", Toast.LENGTH_SHORT).show();
        finish();
    }

    public void toRegister(View v) {
        Intent register = new Intent(this, RegisterActivity.class);
        startActivity(register);
        finish();
    }

    public void animateSuccessLogin() {
        loginButton.disable();
        expandedView.setVisibility(View.VISIBLE);

        // Animate the loader off the screen
        // 200ms
        if (animating) loginButton.finish();

        // Animate the screen to expand
        // 500ms
        int x = expandedView.getWidth();
        int y = expandedView.getHeight();
        float radius = Math.max(x, y) * 1.2f;
        Animator expand = ViewAnimationUtils
                .createCircularReveal(expandedView, x / 2, y / 2, 0, radius);
        expand.setDuration(1000);
        expand.start();

        // Wait and start the chat activity
        // 2.5s
        new Handler().postDelayed(() -> {
            Intent chat = new Intent(this, ChatActivity.class);
            startActivity(chat);
            finish();
        }, 2500);

        // Wait and animate the background color
        // 1s, 1s
        new Handler().postDelayed(() -> {
            ColorDrawable[] colors = {
                    new ColorDrawable(ContextCompat.getColor(this, R.color.primary)),
                    new ColorDrawable(ContextCompat.getColor(this, R.color.white))
            };
            TransitionDrawable transition = new TransitionDrawable(colors);
            expandedView.setBackground(transition);
            transition.startTransition(1000);
        }, 1000);

        animating = false;
    }

    public void Login() {
        setAnimating(true);
        String eml = editTextEml.getText().toString();
        String pswd = editTextPswd.getText().toString();

        if (eml.isEmpty()) {
            Snackbar.make(loginContent, "Email is empty...", Snackbar.LENGTH_SHORT).show();
            setAnimating(false);
            return;
        }

        if (pswd.isEmpty()) {
            Snackbar.make(loginContent, "Password is empty...", Snackbar.LENGTH_SHORT).show();
            setAnimating(false);
            return;
        }

        loginButton.start();

        mAuth.signInWithEmailAndPassword(eml, pswd)
                .addOnSuccessListener(result -> {
                    if (result.getUser() == null) {
                        Log.e(TAG, "No user!!!");
                        return;
                    }
                    fillAndFinish(result.getUser().getUid());
                }).addOnFailureListener(onFailure);
    }

    /**
     * Fills in the user details into the expanded view before animating it
     *
     * @param uid User ID
     */
    public void fillAndFinish(String uid) {
        firestore
                .collection("users")
                .document(uid)
                .get()
                .addOnSuccessListener(snap -> {
                    if (snap.exists()) {
                        User user = snap.toObject(User.class);
                        assert user != null;

                        Glide.with(this).load(user.getPfp()).into(pfpImage);
                        String welcome = "Welcome back\n" + user.getUsnm();
                        usnmText.setText(welcome);
                        animateSuccessLogin();
                    }
                })
                .addOnFailureListener(onFailure);
    }

    public void setAnimating(boolean animating) {
        if (animating) {
            editTextEml.setEnabled(false);
            editTextPswd.setEnabled(false);
            loginButton.disable();
            googleButton.disable();
        } else {
            editTextEml.setEnabled(true);
            editTextPswd.setEnabled(true);
            loginButton.enable();
            googleButton.enable();
        }

        this.animating = animating;
    }
}
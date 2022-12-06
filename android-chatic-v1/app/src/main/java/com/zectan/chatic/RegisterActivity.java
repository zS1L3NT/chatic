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

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.zectan.chatic.Model.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.regex.Pattern;

public class RegisterActivity extends AppCompatActivity {
    private static final String TAG = "RegisterActivity";
    private boolean animating;

    private FirebaseAuth mAuth;
    private FirebaseFirestore firestore;

    private EditText editTextUsnm;
    private EditText editTextEml;
    private EditText editTextPswd;

    private GoogleSignInFragment googleButton;
    private LoadingButtonFragment registerButton;

    private LinearLayout registerContent;
    /**
     * Show errors via a material design popup
     */
    public OnFailureListener onFailure = (e) -> {
        new MaterialAlertDialogBuilder(registerContent.getRootView().getContext())
                .setTitle("Register Failure")
                .setMessage(e.getMessage())
                .setNeutralButton("Ok", (dialog, which) -> {
                })
                .show();
        if (animating) registerButton.end();
        setAnimating(false);
    };

    private ConstraintLayout expandedView;
    private ImageView pfpImage;
    private TextView usnmText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
        animating = false;

        mAuth = FirebaseAuth.getInstance();
        firestore = FirebaseFirestore.getInstance();

        editTextUsnm = findViewById(R.id.register_edit_text_usnm);
        editTextEml = findViewById(R.id.register_edit_text_eml);
        editTextPswd = findViewById(R.id.register_edit_text_pswd);

        googleButton = new GoogleSignInFragment();
        registerButton = new LoadingButtonFragment();

        registerContent = findViewById(R.id.register_content);

        expandedView = findViewById(R.id.register_expand_button);
        pfpImage = findViewById(R.id.register_expand_pfp);
        usnmText = findViewById(R.id.register_expand_usnm);

        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.sign_in_google, googleButton)
                .replace(R.id.register_button, registerButton)
                .commit();
    }

    public void toLogin(View view) {
        Intent login = new Intent(this, LoginActivity.class);
        startActivity(login);
        finish();
    }

    public void animateSuccessRegister() {
        registerButton.disable();
        expandedView.setVisibility(View.VISIBLE);

        // Animate the loader off the screen
        // 200ms
        if (animating) registerButton.finish();

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
    }

    public void Register() {
        setAnimating(true);
        String usnm = editTextUsnm.getText().toString();
        String eml = editTextEml.getText().toString();
        String pswd = editTextPswd.getText().toString();

        if (usnm.isEmpty()) {
            Snackbar.make(registerContent, "Username is empty...", Snackbar.LENGTH_SHORT).show();
            setAnimating(false);
            return;
        }

        if (usnm.length() < 3 || usnm.length() > 20) {
            Snackbar.make(registerContent, "Username must be between 3 and 20 characters...", Snackbar.LENGTH_SHORT).show();
            setAnimating(false);
            return;
        }

        if (!Pattern.matches("^\\w*$", usnm)) {
            Snackbar.make(registerContent, "Username must only contain letters, numbers or underscores...", Snackbar.LENGTH_SHORT).show();
            setAnimating(false);
            return;
        }

        if (eml.isEmpty()) {
            Snackbar.make(registerContent, "Email is empty...", Snackbar.LENGTH_SHORT).show();
            setAnimating(false);
            return;
        }

        if (pswd.isEmpty()) {
            Snackbar.make(registerContent, "Password is empty...", Snackbar.LENGTH_SHORT).show();
            setAnimating(false);
            return;
        }

        registerButton.start();

        // Create FirebaseAuth user
        mAuth.createUserWithEmailAndPassword(eml, pswd)
                .addOnSuccessListener(result -> {
                    FirebaseUser user = result.getUser();

                    if (user == null) {
                        Log.e(TAG, "No user!!!");
                        return;
                    }

                    String uid = user.getUid();
                    String pfp = getString(R.string.default_pfp);

                    User newUser = new User(uid, usnm, eml, pfp, new ArrayList<>(), new HashMap<>());

                    // Create Firestore user
                    firestore
                            .collection("users")
                            .document(uid)
                            .set(newUser)
                            .addOnSuccessListener(snap -> fillAndFinish(usnm, pfp))
                            .addOnFailureListener(onFailure);
                })
                .addOnFailureListener(onFailure);
    }

    /**
     * Fills in the user details into the expanded view before animating it
     *
     * @param usnm User ID
     * @param pfp  Profile picture
     */
    public void fillAndFinish(String usnm, String pfp) {
        Glide.with(this).load(pfp).into(pfpImage);
        String welcome = "Welcome to Chatic\n" + usnm;
        usnmText.setText(welcome);
        animateSuccessRegister();
    }

    public void setAnimating(boolean animating) {
        if (animating) {
            editTextEml.setEnabled(false);
            editTextPswd.setEnabled(false);
            registerButton.disable();
            googleButton.disable();
        } else {
            editTextEml.setEnabled(true);
            editTextPswd.setEnabled(true);
            registerButton.enable();
            googleButton.enable();
        }
    }
}
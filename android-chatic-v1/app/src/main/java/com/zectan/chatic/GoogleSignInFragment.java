package com.zectan.chatic;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.fragment.app.Fragment;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GoogleAuthProvider;
import com.google.firebase.firestore.FirebaseFirestore;
import com.zectan.chatic.Model.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class GoogleSignInFragment extends Fragment {
    public static final String TAG = ".GoogleSignInFragment";
    private AA aa;
    private FirebaseAuth mAuth;
    private FirebaseFirestore firestore;
    private GoogleSignInClient mGoogleSignInClient;

    private View button;

    private ActivityResultLauncher<Intent> launcher;

    public GoogleSignInFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        aa = new AA(requireActivity());
        launcher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() != Activity.RESULT_OK) {
                        aa.onFailure(new Exception("Google sign in error"));
                        return;
                    }

                    Intent data = result.getData();
                    Task<GoogleSignInAccount> signInTask = GoogleSignIn.getSignedInAccountFromIntent(data);
                    GoogleSignInAccount account;
                    try {
                        // Google Sign In was successful, authenticate with Firebase
                        account = signInTask.getResult(ApiException.class);
                        assert account != null;
                    } catch (ApiException e) {
                        // Google Sign In failed, update UI appropriately
                        aa.onFailure(e);
                        return;
                    }

                    String eml = account.getEmail();

                    mAuth.fetchSignInMethodsForEmail(eml)
                            .addOnSuccessListener(methodRes -> {
                                List<String> methods = methodRes.getSignInMethods();
                                AuthCredential credential = GoogleAuthProvider.getCredential(account.getIdToken(), null);

                                if (getActivity() instanceof LoginActivity) {
                                    // Login

                                    if (methods.size() >= 0) {
                                        // Login and has sign in methods
                                        Login(credential);
                                    } else {
                                        // Login and has no sign in methods
                                        aa.onFailure(new Exception("Your Google account isn't connected to any Chatic accounts"));
                                    }
                                } else {
                                    // Register

                                    if (methods.size() == 0) {
                                        // Register and has no sign in methods
                                        Register(credential);
                                    } else {
                                        // Register and has sign in methods
                                        aa.onFailure(new Exception("Your Google account is already connected to a Chatic account"));
                                    }
                                }
                            })
                            .addOnFailureListener(aa::onFailure);

                });
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.fragment_google_sign_in_button, container, false);

        mAuth = FirebaseAuth.getInstance();
        firestore = FirebaseFirestore.getInstance();
        GoogleSignInOptions gso = new GoogleSignInOptions
                .Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.default_web_client_id))
                .requestEmail()
                .build();
        mGoogleSignInClient = GoogleSignIn.getClient(requireActivity(), gso);

        button = v.findViewById(R.id.sign_in_google_button);
        button.setOnClickListener(this::signIn);

        return v;
    }

    public void signIn(View v) {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        launcher.launch(signInIntent);
        aa.setAnimating(true);
    }

    // Login and finish
    private void Login(AuthCredential credential) {
        mAuth.signInWithCredential(credential)
                .addOnSuccessListener(result -> aa.fillAndFinish(result.getUser().getUid()))
                .addOnFailureListener(aa::onFailure);
    }

    // Register and finish
    private void Register(AuthCredential credential) {
        mAuth.signInWithCredential(credential)
                .addOnSuccessListener(result -> {
                    FirebaseUser mUser = mAuth.getCurrentUser();
                    assert mUser != null;

                    String uid = mUser.getUid();
                    String usnm = mUser.getDisplayName();
                    String eml = mUser.getEmail();
                    String pfp;
                    if (mUser.getPhotoUrl() == null) {
                        pfp = getString(R.string.default_pfp);
                    } else {
                        pfp = mUser.getPhotoUrl().toString();
                    }

                    firestore
                            .collection("users")
                            .document(uid)
                            .set(new User(uid, usnm, eml, pfp, new ArrayList<>(), new HashMap<>()))
                            .addOnSuccessListener(x -> aa.fillAndFinish(uid))
                            .addOnFailureListener(aa::onFailure);
                })
                .addOnFailureListener(aa::onFailure);
    }

    public void disable() {
        button.setEnabled(false);
    }

    public void enable() {
        button.setEnabled(true);
    }

    /**
     * Activity adapter
     */
    private class AA {
        LoginActivity la;
        RegisterActivity ra;

        public AA(Activity activity) {
            if (activity instanceof RegisterActivity) {
                ra = (RegisterActivity) activity;
                return;
            }

            if (activity instanceof LoginActivity) {
                la = (LoginActivity) activity;
                return;
            }

            throw new Error("Unknown activity type");
        }

        public void fillAndFinish(String uid) {
            if (ra != null) {
                firestore.collection("users")
                        .document(uid)
                        .get()
                        .addOnSuccessListener(snap -> {
                            if (snap.exists()) {
                                User user = snap.toObject(User.class);

                                assert user != null;

                                String usnm = user.getUsnm();
                                String pfp = user.getPfp();

                                ra.fillAndFinish(usnm, pfp);
                            } else {
                                Log.e(TAG, "Auth user has no Firestore data");
                            }
                        }).addOnFailureListener(this::onFailure);
                return;
            }

            if (la != null) {
                la.fillAndFinish(uid);
                return;
            }

            throw new Error("Unknown activity type");
        }

        public void onFailure(Exception e) {
            if (ra != null) {
                ra.onFailure.onFailure(e);
                return;
            }

            if (la != null) {
                la.onFailure.onFailure(e);
                return;
            }

            throw new Error("Unknown activity type");
        }

        public void setAnimating(boolean animating) {
            if (ra != null) {
                ra.setAnimating(animating);
                return;
            }

            if (la != null) {
                la.setAnimating(animating);
                return;
            }

            throw new Error("Unknown activity type");
        }
    }
}
package com.zectan.chatic;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.fragment.app.Fragment;

public class LoadingButtonFragment extends Fragment {
    private static final String TAG = "LoadingButtonFragment";
    private AA aa;
    private View buttonFrame;
    private TextView buttonText;
    private ProgressBar buttonLoader;

    public LoadingButtonFragment() {
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        aa = new AA(getActivity());
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.fragment_loading_button, container, false);
        buttonFrame = v.findViewById(R.id.button_frame);
        buttonText = v.findViewById(R.id.button_text);
        buttonLoader = v.findViewById(R.id.button_loader);

        buttonLoader.getIndeterminateDrawable()
                .setColorFilter(Color.parseColor("#ffffff"), PorterDuff.Mode.SRC_IN);

        buttonFrame.setOnClickListener(aa::onClick);

        return v;
    }

    public void start() {
        hideText();
        showLoader();
        disable();
    }

    public void end() {
        showText();
        hideLoader();
        enable();
    }

    public void finish() {
        hideLoader();
    }

    public void disable() {
        buttonFrame.setEnabled(false);
    }

    public void enable() {
        buttonFrame.setEnabled(true);
    }

    private void hideText() {
        buttonText.animate().alpha(0f).setDuration(250).start();
    }

    private void showText() {
        buttonText.animate().alpha(1f).setDuration(250).start();
    }

    private void hideLoader() {
        buttonLoader.animate().alpha(0f).setDuration(250).start();
    }

    private void showLoader() {
        buttonLoader.animate().alpha(1f).setDuration(250).start();
    }

    private static class AA {
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

        public void onClick(View v) {
            if (ra != null) {
                ra.Register();
                return;
            }

            if (la != null) {
                la.Login();
                return;
            }

            throw new Error("Unknown activity type");
        }
    }
}
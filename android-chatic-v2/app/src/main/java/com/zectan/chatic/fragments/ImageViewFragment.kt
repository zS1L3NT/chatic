package com.zectan.chatic.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.navArgs
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions
import com.zectan.chatic.R
import com.zectan.chatic.classes.Fragment
import com.zectan.chatic.databinding.FragmentImageViewBinding

class ImageViewFragment : Fragment<FragmentImageViewBinding>(R.menu.menu_image_view) {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentImageViewBinding.inflate(inflater)
        super.onCreateView(inflater, container, savedInstanceState)
        val url = navArgs<ImageViewFragmentArgs>().value.url

        Glide
            .with(this)
            .load(url)
            .transition(DrawableTransitionOptions().crossFade())
            .centerInside()
            .into(binding.displayImage)

        return binding.root
    }
}
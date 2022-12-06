package com.zectan.chatic.classes

import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Observer

/**
 * Strict Live Data is an extension of MutableLiveData with @NotNull @NonNull annotations.
 * Makes sure the value from Live Data is not null
 *
 * @param value Value
 */
class StrictLiveData<T>(value: T) : MutableLiveData<T>(value) {
    override fun postValue(value: T) {
        super.postValue(value)
    }

    override fun observe(owner: LifecycleOwner, observer: Observer<in T>) {
        super.observe(owner, observer)
    }

    override fun getValue(): T {
        return super.getValue()!!
    }

    override fun setValue(value: T) {
        super.setValue(value)
    }
}
package com.location.exceptions;

public class ImageNotValidException extends Throwable {
    public ImageNotValidException(String imageIsNotValid) {
        super(imageIsNotValid);
    }
}

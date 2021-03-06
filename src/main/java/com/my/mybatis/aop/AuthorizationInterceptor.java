package com.my.mybatis.aop;

import com.my.mybatis.Constants;
import com.my.mybatis.controller.Authorization;
import com.my.mybatis.controller.RequestException;
import com.my.mybatis.mapper.Token;
import com.my.mybatis.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;

@Component
public class AuthorizationInterceptor extends HandlerInterceptorAdapter {

    private final TokenService tokenService;

    @Autowired
    public AuthorizationInterceptor(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws RequestException {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Class bean = handlerMethod.getBeanType();
        Method method = handlerMethod.getMethod();
        if (bean.getAnnotation(Authorization.class) == null && method.getAnnotation(Authorization.class) == null){
            return true;
        }
        Authorization a = (Authorization) bean.getAnnotation(Authorization.class);
        if (a == null)  a = (Authorization) method.getAnnotation(Authorization.class);

        String token = request.getHeader(Constants.AUTHORIZATION);
        if (token == null) {
            throw new RequestException("Authorization Error", HttpStatus.UNAUTHORIZED);
        }
        Token tokenEntity = new Token();
        tokenEntity.setToken(token);

        if (tokenService.checkToken(tokenEntity)) {
            if (a.isAdmin() && tokenEntity.getUser().getId() != 1) {
                throw new RequestException("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
            request.setAttribute(Constants.CURRENT_TOKEN, tokenEntity);
            request.setAttribute(Constants.CURRENT_USER, tokenEntity.getUser());
            return true;
        } else {
            throw new RequestException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
    }
}

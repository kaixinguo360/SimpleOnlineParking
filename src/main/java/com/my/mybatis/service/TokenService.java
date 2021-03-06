package com.my.mybatis.service;

import com.my.mybatis.mapper.Token;
import com.my.mybatis.mapper.User;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
public class TokenService {

    private Map<String, Token> tokens = new HashMap<>();

    @NotNull
    public Token createToken(@NotNull User user) {
        String token = UUID.randomUUID().toString();
        Token tokenEntity = new Token(token, user);
        tokens.put(token, tokenEntity);
        return tokenEntity;
    }

    public boolean checkToken(Token tokenEntity) {
        if (tokenEntity == null) {
            return false;
        }
        Token token = tokens.get(tokenEntity.getToken());
        if (token != null) {
            tokenEntity.setUser(token.getUser());
            return true;
        } else {
            return false;
        }
    }

    public void removeToken(String token) {
        tokens.remove(token);
    }

    public void removeToken(User user) {
        tokens.entrySet().removeIf(entry -> Objects.requireNonNull(entry.getValue().getUser()).getId() == user.getId());
    }
}

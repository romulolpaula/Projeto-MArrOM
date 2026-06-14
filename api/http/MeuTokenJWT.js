const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports = class MeuTokenJWT {
  #key;
  #alg;
  #type;
  #iss;
  #aud;
  #sub;
  #duracaoToken;
  #payload;

  constructor() {
    this.#key = "CHAVE_SECRETA_GENERICA_PARA_DESENVOLVIMENTO_LOCAL_UNIVAP_2026";
    this.#alg = "HS256";
    this.#type = "JWT";
    this.#iss = "http://localhost";
    this.#aud = "http://localhost";
    this.#sub = "acesso_sistema";
    this.#duracaoToken = 3600 * 24 * 60;
    this.#payload = null;
  }

  gerarToken = (claims) => {
    const headers = { alg: this.#alg, typ: this.#type };
    const payload = {
      iss: this.#iss,
      aud: this.#aud,
      sub: this.#sub,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.#duracaoToken,
      nbf: Math.floor(Date.now() / 1000),
      jti: crypto.randomBytes(16).toString("hex"),
      email: claims.email,
      role: claims.role,
      name: claims.name,
      idFuncionario: claims.idFuncionario,
    };
    return jwt.sign(payload, this.#key, {
      algorithm: this.#alg,
      header: headers,
    });
  };

  validarToken = (stringToken) => {
    if (!stringToken || stringToken.trim() === "") return false;
    const token = stringToken.replace("Bearer ", "").trim();
    try {
      const decoded = jwt.verify(token, this.#key, { algorithms: [this.#alg] });
      this.#payload = decoded;
      return true;
    } catch (err) {
      console.error("Token inválido:", err.message);
      return false;
    }
  };

  get key() {
    return this.#key;
  }
  get alg() {
    return this.#alg;
  }
  get type() {
    return this.#type;
  }
  get iss() {
    return this.#iss;
  }
  get aud() {
    return this.#aud;
  }
  get sub() {
    return this.#sub;
  }
  get duracaoToken() {
    return this.#duracaoToken;
  }
  get payload() {
    return this.#payload;
  }
};

module.exports = class IDAO {
  create(model) {
    throw new Error(
      `[IDAO] O método 'create' deve ser implementado por ${this.constructor.name}`,
    );
  }
  findAll() {
    throw new Error(
      `[IDAO] O método 'findAll' deve ser implementado por ${this.constructor.name}`,
    );
  }
  findById(id) {
    throw new Error(
      `[IDAO] O método 'findById' deve ser implementado por ${this.constructor.name}`,
    );
  }
  update(model) {
    throw new Error(
      `[IDAO] O método 'update' deve ser implementado por ${this.constructor.name}`,
    );
  }
  delete(model) {
    throw new Error(
      `[IDAO] O método 'delete' deve ser implementado por ${this.constructor.name}`,
    );
  }
};

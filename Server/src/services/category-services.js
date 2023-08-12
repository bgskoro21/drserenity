import { prismaClient } from "../application/database.js";
import { ResponseError } from "../err/response-error.js";
import { createCategoryValidation, getCategoryByIdValidation, updateCategoryValidation } from "../validation/category-validation.js";
import { validate } from "../validation/validation.js";
import fs from "fs";

const create = async (request) => {
  request = validate(createCategoryValidation, request);

  return prismaClient.kategori.create({
    data: request,
    select: {
      id: true,
      name: true,
      picture: true,
    },
  });
};

const getAllCategory = async () => {
  return prismaClient.kategori.findMany();
};

const getCategoryById = async (id) => {
  id = validate(getCategoryByIdValidation, id);

  const category = await prismaClient.kategori.findFirst({
    where: {
      id: id,
    },
  });

  if (!category) {
    throw new ResponseError(404, "Category not found!");
  }

  return category;
};

const update = async (request) => {
  request = validate(updateCategoryValidation, request);

  const category = await prismaClient.kategori.findFirst({
    where: {
      id: request.id,
    },
    select: {
      id: true,
      name: true,
      picture: true,
    },
  });

  if (!category) {
    const path = "./public/images/" + request.picture.split("/")[3];

    fs.unlink(path, (err) => {
      if (err) {
        console.error("Gagal menghapus gambar lama:", err);
      } else {
        console.log("Gambar lama berhasil dihapus");
      }
    });
    throw new ResponseError(404, "Category not found!");
  }

  const data = {};

  data.name = request.name;

  if (request.picture) {
    const filename = category.picture.split("/")[3];
    const path = "./public/images/" + filename;
    fs.unlink(path, (err) => {
      if (err) {
        console.error("Gagal menghapus gambar lama:", err);
      } else {
        console.log("Gambar lama berhasil dihapus");
      }
    });

    data.picture = request.picture;
  }

  return prismaClient.kategori.update({
    data: data,
    where: {
      id: request.id,
    },
    select: {
      id: true,
      name: true,
      picture: true,
    },
  });
};

const destroy = async (id) => {
  id = validate(getCategoryByIdValidation, id);

  const category = await prismaClient.kategori.findFirst({
    where: {
      id: id,
    },
  });

  if (!category) {
    throw new ResponseError(404, "Category not found!");
  }

  if (category.picture !== null) {
    const filename = category.picture.split("/")[3];
    const path = "./public/images/" + filename;
    fs.unlink(path, (err) => {
      if (err) {
        console.error("Gagal menghapus gambar lama:", err);
      } else {
        console.log("Berhasil menghapus gambar lama");
      }
    });
  }

  return prismaClient.kategori.delete({
    where: {
      id: id,
    },
  });
};

export default {
  create,
  getAllCategory,
  getCategoryById,
  update,
  destroy,
};

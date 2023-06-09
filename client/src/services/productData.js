import url from "../url.js";
const baseUrl = url;

export async function getAll(page, category, query) {
  // 쿼리문이 공백이면 node js 가 돌아가고있는 http://localhost:5000 포트에서 데이터를 가지고옴
  // node 서버 예시 http://localhost:5000/products?page=2&search=BMW
  if (query !== "" && query !== undefined) {
    return (
      await fetch(`${baseUrl}/products?page=${page}&search=${query}`, {
        credentials: "include",
      })
    ).json();
  } else if (category && category !== "all") {
    return (
      await fetch(`${baseUrl}/products/${category}?page=${page}`, {
        credentials: "include",
      })
    ).json();
  } else {
    return (
      await fetch(`${baseUrl}/products?page=${page}`, {
        credentials: "include",
      })
    ).json();
  }
}

export async function getSpecific(id) {
  
  return (
    await fetch(`${baseUrl}/products/specific/${id}`, {
      credentials: "include",
    })
  ).json();
}

export async function createProduct(product) {
  return (
    await fetch(`${baseUrl}/products/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(product),
    })
    ).json();
  }
  
  export async function editProduct(id, product) {
    return (
      await fetch(`${baseUrl}/products/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(product),
      })
      ).json();
    }

    export async function deleteProduct(id) {
      return (
        await fetch(`${baseUrl}/products/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
      ).json();
    }
    
    export async function activateSell(id) {
      return (await fetch(`${baseUrl}/products/enable/${id}`)).json();
    }
    
    export async function archiveSell(id) {
      return (await fetch(`${baseUrl}/products/archive/${id}`)).json();
    }

    export async function archiveSoldout(id) {
      return (await fetch(`${baseUrl}/products/soldout/${id}`)).json();
    }
    
    export async function wishProduct(id) {
      return (
        await fetch(`${baseUrl}/products/wish/${id}`, { credentials: "include" })
        ).json();
      }
      
    export async function views(id) {
      return (
        await fetch(`${baseUrl}/products/views/${id}`, {
          credentials: "include"
        })
      ).json();
    }

    export async function declareProduct(declareproduct) {
      console.log('ProductDataController', declareproduct);

      await fetch(`${baseUrl}/products/declare/${declareproduct}`, {
        credentials: "include"
      })
  }



    


  
export class Product {
  product_id: number;
  product_name: string;
  product_description: string;
  product_short_description: string;
  product_count: number;
  product_price: number;
  product_color: string;
  product_keywords_seo: string;
  product_description_seo: string;
  product_manufacturer: string;
  product_type: number;
  category_name: string;
  category_url: string;
  subcategory_id:  number;
  product_available: boolean;
  product_status: string;
  images_mini: string;
  images_middle: string;
  images_large: string;
  subcategory_name: string;
  product_date_add: Date;
  product_ispromo: boolean;
  product_promo_price: number;
  subcategory_url: string;
  category_description_seo: string;
  category_keywords_seo: string;
  subcategory_description_seo: string;
  subcategory_keywords_seo: string;
  avalible_in_group: number;
  product_options: [{
    option_category: string,
    option_id: number,
    option_name: string,
    option_product_id: number,
    option_value: string,
    product_id: number
  }] ;
}

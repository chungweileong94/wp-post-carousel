<?php

/**
 * @package WrPostCarousel
 */
/*
Plugin Name: WR Post Carousel
Version: 1.0.0
Author: White Room
*/

// prevent someone from outside access to this
defined('ABSPATH') or die('Hey, I cannot recognize you!');

class WrPostCarousel
{
  function __construct()
  {
    $this->register_short_code();
  }

  function activate()
  {
    $this->register_short_code();
    flush_rewrite_rules();
  }

  function deactivate()
  {
    flush_rewrite_rules();
  }

  function register_short_code()
  {
    add_shortcode('wr-post-carousel', function ($attrs) {
      wp_enqueue_style('wr-post-carousel-style', plugins_url('/front/dist/bundle.css', __FILE__), []);
      wp_enqueue_script('wr-post-carousel-js', plugins_url('/front/dist/bundle.js', __FILE__), [], null, true);

      $posts = get_posts();

      $html = '
        <div class="wr__post-carousel">
          <div class="wr__post-items-wrapper">
            <div class="wr__post-items">
      ';

      foreach ($posts as $post) {
        $post_title = $post->post_title;
        $post_excerpt = $post->post_excerpt;
        $post_image_url = get_the_post_thumbnail_url($post->ID, 'full');
        $post_link = get_post_permalink($post->ID);

        $html .= sprintf('
            <div class="wr__post-item">
              <img src="%s" class="wr__post_item__image" />
              <div class="wr__post-item__info-wrapper">
                <div class="wr__post-item__text-wrapper">
                  <div class="wr__post_item__title">%s</div>
                  <div class="wr__post_item__excerpt">%s</div>
                </div>
                <a href="%s" class="wr__post-item__book-button">Book It</a>
              </div>
            </div>
          ', $post_image_url, $post_title, $post_excerpt, $post_link);
      }

      $html .= '
            </div>
          </div>
        </div>
      ';

      return $html;
    });
  }
}

if (class_exists('WrPostCarousel')) {
  $wr_post_carousel = new WrPostCarousel();
}

// activation
register_activation_hook(__FILE__, [$wr_post_carousel, 'activate']);

// deactivation
register_deactivation_hook(__FILE__, [$wr_post_carousel, 'deactivate']);

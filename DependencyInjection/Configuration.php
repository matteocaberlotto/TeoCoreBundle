<?php

namespace Teo\CoreBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('topan_core');

        // Here you should define the parameters that are allowed to
        // configure your bundle. See the documentation linked above for
        // more information on that topic.
        $rootNode
            ->children()
                ->arrayNode('website')
                    ->children()
                        ->scalarNode('title')
                            ->defaultValue('Default title')
                        ->end()
                        ->scalarNode('description')
                            ->defaultValue('Default description')
                        ->end()
                        ->scalarNode('author')
                            ->defaultValue('Matteo Caberlotto')
                        ->end()
                        ->scalarNode('keywords')
                            ->defaultValue('some, keywords')
                        ->end()
                        ->scalarNode('og_image')
                            ->defaultValue('bundles/teocore/images/default.jpg')
                        ->end()
                        ->scalarNode('analytics_ua')
                            ->defaultValue('UA-XXXXXXXX-X')
                        ->end()
                        ->scalarNode('analytics_domain')
                            ->defaultValue('example.com')
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('sitemap')
                    ->prototype('array')
                        ->children()
                            ->scalarNode('loc')->end()
                            ->scalarNode('changefreq')->end()
                            ->scalarNode('priority')->end()
                        ->end()
                    ->end()
                ->end()
            ->end()
            ;

        return $treeBuilder;
    }
}
